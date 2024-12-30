import { getCompletedSession, importSession, getRoundsBySession, getSession, initDB } from "../../../../../lib/db/indexedDB";
import { Value, ValueWithReason, Session, CompletedSession, Round } from "../../../../../lib/types";
import { saveAs } from 'file-saver-es';
import { generateSessionName } from "../../../../../components/features/Exercise/utils";

export const formatDate = (timestamp: number) => {
    return new Date(timestamp).toLocaleString();
};

export const handleShowValues = async (sessionId: string, setIsLoading: (loading: boolean) => void, setCurrentValues: (values: Value[]) => void, setShowValuesFor: (sessionId: string | null) => void) => {
    setIsLoading(true);
    try {
        const completedSession = await getCompletedSession(sessionId);
        if (completedSession?.finalValues) {
            setCurrentValues(completedSession.finalValues);
            setShowValuesFor(sessionId);
        }
    } catch (error) {
        console.error('Error loading values:', error);
    } finally {
        setIsLoading(false);
    }
};

export const handleExportSession = async (sessionId: string, sessions: Session[]) => {
    const session = sessions.find(s => s.id === sessionId);
    if (session) {
        const completedSession = await getCompletedSession(sessionId);
        const rounds = await getRoundsBySession(sessionId);
        const exportData = {
            session,
            completedSession,
            rounds
        };
        const blob = new Blob([JSON.stringify(exportData)], { type: 'application/json' });
        saveAs(blob, `session-${sessionId}.json`);
    }
};

export const handleImportSession = async (event: React.ChangeEvent<HTMLInputElement>, setReload: (reload: boolean) => void, reload: boolean) => {
    const file = event.target.files?.[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = async (e) => {
            try {
                const importData = JSON.parse(e.target?.result as string);
                let { session, completedSession, rounds } = importData as { session: Session, completedSession: CompletedSession, rounds: Round[] };

                // Check if session ID already exists
                const existingSession = await getSession(session.id);
                if (existingSession) {
                    // Generate a new unique session name
                    const db = await initDB(); // Initialize the database
                    const newSessionId = await generateSessionName(db);

                    // Assign the new unique ID to the session and related entities
                    session = { ...session, id: newSessionId };
                    completedSession = { ...completedSession, sessionId: newSessionId };
                    rounds = rounds.map((round) => ({ ...round, sessionId: newSessionId }));

                    console.log(`Session ID conflict. Renamed to: ${newSessionId}`);
                }


                await importSession(session, completedSession, rounds);
                console.log('Session imported successfully');
                setReload(!reload); // Trigger reload
            } catch (error) {
                console.error('Error importing session:', error);
            }
        };
        reader.readAsText(file);
    }
};

export const handleCopyToClipboard = (values: ValueWithReason[], setCopySuccess: (success: boolean) => void) => {
    const formattedText = `My Core Values\n--------------\n\n`
        + values.map(formatValueForClipboard).join('') + `\n\nCreated with https://core-values.me`;

    navigator.clipboard.writeText(formattedText)
        .then(() => {
            console.log('Copied to clipboard');
            setCopySuccess(true);
        })
        .catch(err => {
            console.error('Failed to copy:', err);
            setCopySuccess(false);
        });
};

const formatValueForClipboard = (value: ValueWithReason): string => {
    return `Title: ${value.title}\nDescription: ${value.description}${value.reason ? `\nWhy: ${value.reason}` : ''}\n\n`;
};

export const generateFullText = (values: ValueWithReason[]): string => {
    return values.map(value => `${value.title}${value.description ? ` - ${value.description}` : ''}`).join(', ');
};

export const generateTitles = (values: ValueWithReason[]): string => {
    return values.map(value => value.title).join(', ');
};

export const formatTextForPlatform = (values: ValueWithReason[], platform: 'bluesky' | 'twitter' | 'linkedin'): string => {
    const baseText = `My Core Values: `;
    const link = ` https://core-values.me`;
    const maxLength = platform === 'bluesky' ? 300 : platform === 'twitter' ? 144 : Infinity;

    const fullText = baseText + generateFullText(values) + link;
    const titlesText = baseText + generateTitles(values) + link;

    if (fullText.length <= maxLength) {
        return fullText;
    }
    else if (titlesText.length <= maxLength) {
        return titlesText;
    }
    else {
        return titlesText.substring(0, maxLength - 3) + '...';
    }
};

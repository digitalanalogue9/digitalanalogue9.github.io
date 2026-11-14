# 04: Export complete values-session backups

**What to build:** A participant can export a complete values-session backup from Completed or History and import it
later with its saved reflection intact.

**Blocked by:** None (can start immediately).

**Status:** resolved

- [x] Standard values-session JSON exports from Completed and History include the saved session, values and reflection
      notes, and the interface makes it clear that the file contains personal notes.
- [x] Remove the redundant separate reflection-backup action from History while keeping the standard export accessible.
- [x] Import newly exported sessions with their reflection intact and continue to accept supported earlier standard
      exports, reflection backups and legacy backups, including files without reflection.
- [x] Preserve existing session-ID collision handling and validate imported reflection references without overwriting
      existing local work.
- [x] Leave the separate behaviour-reflection feature and its private-text export choices unchanged.
- [x] Verify complete round trips, older formats, collision handling and invalid imports through the existing
      session-service and backup test seam; update obsolete expectations that standard values exports omit reflection.

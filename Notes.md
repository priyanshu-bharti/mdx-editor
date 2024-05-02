Styling:
    - Make the editor full height
    - Add dark theme to the editor

State Management & Saving
    - Save editor state to indexed db
    - Get the state from indexed db when user opens the page
    - Add ability to export the notes

Possible ideas
- Debounce saving of notes to indexedDB when the user is typing, and only make the notes persistent after the user stops typing.
- Prefer indexedDB as it is async and won't block the main thread (as we'll need main thread to do a bunch of fancy stuff.)
- Figure out a way to convert the markdown string to markdown file which gets downloaded at the client side.

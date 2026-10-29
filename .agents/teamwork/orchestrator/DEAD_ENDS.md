# Dead Ends Tracking

| Iteration | Approach Tried | Why It Failed | Files Touched |
|-----------|---------------|---------------|---------------|
| 1 | Using Tailwind utility classes (`w-16`, `h-16`, `w-full`, `h-full`, `object-cover`, `overflow-hidden`) for upcoming class card thumbnail in `src/App.jsx` | Project does not compile or include Tailwind CSS; classes are undefined in `src/styles.css`, causing the 1024x1024 JPEG to render at unconstrained natural size (1024x1024px) inflating card height to 1,309px. | `src/App.jsx` |

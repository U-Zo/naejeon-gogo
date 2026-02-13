## ADDED Requirements

### Requirement: Race page route and navigation
The system SHALL provide a `/race` route accessible from the bottom tab navigation. The tab SHALL display a race icon and "경주" label.

#### Scenario: Navigate to race page
- **WHEN** user taps the "경주" tab in the bottom navigation
- **THEN** the app navigates to `/race` and displays the race page

### Requirement: Member selection for race
The system SHALL allow users to select exactly 10 members before starting a race. The selection UI SHALL follow the same pattern as the existing matchmaking page's select phase.

#### Scenario: Select 10 members
- **WHEN** user selects 10 members from the member list
- **THEN** the "경주 시작" button becomes enabled

#### Scenario: Attempt to start with fewer than 10
- **WHEN** user clicks "경주 시작" with fewer than 10 members selected
- **THEN** the system displays an error message indicating 10 members are required

### Requirement: Physics-based race simulation
The system SHALL run a 2D physics simulation using Matter.js where each selected member is represented as a racer body. Racers SHALL move from left to right on a horizontal track. The simulation SHALL use random forces to propel racers, making each race outcome unpredictable.

#### Scenario: Race starts
- **WHEN** user clicks "경주 시작" with 10 members selected
- **THEN** the system initializes a Matter.js physics world with 10 racer bodies at the left side of a horizontal track, and begins the simulation

#### Scenario: Racers move with random forces
- **WHEN** the simulation is running
- **THEN** each racer receives random horizontal forces at periodic intervals, causing varied acceleration and speed changes

#### Scenario: Racer collision
- **WHEN** two racers collide during the race
- **THEN** the physics engine resolves the collision naturally, potentially changing both racers' velocities and trajectories

### Requirement: Race duration control
The system SHALL ensure each race lasts between 1 minute minimum and 2 minutes maximum. If no racer has finished after 2 minutes, the system SHALL apply boost forces to remaining racers to force completion.

#### Scenario: Normal race duration
- **WHEN** a race is in progress
- **THEN** the first racer crosses the finish line no earlier than 1 minute after start

#### Scenario: Race exceeds maximum duration
- **WHEN** the race has been running for 2 minutes and racers remain unfinished
- **THEN** the system applies increasing boost forces to remaining racers until all cross the finish line

### Requirement: Camera system
The system SHALL implement a virtual camera that renders the race on a Canvas element. The camera SHALL initially show the entire track (zoomed out) and progressively zoom in on remaining racers as others finish.

#### Scenario: Initial camera view
- **WHEN** the race begins
- **THEN** the camera shows the full track including all racers and the finish line

#### Scenario: Camera zoom on finish
- **WHEN** one or more racers cross the finish line
- **THEN** the camera smoothly transitions to frame only the remaining unfinished racers, resulting in a closer view

#### Scenario: Final racers close-up
- **WHEN** only 2-3 racers remain unfinished
- **THEN** the camera is zoomed in closely on those racers, creating tension for the final team assignment

### Requirement: Real-time ranking overlay
The system SHALL display a real-time ranking list on the canvas (top-right corner) showing all racers sorted by their current progress along the track. The ranking SHALL update every frame as part of the canvas render cycle.

#### Scenario: Ranking display during race
- **WHEN** the race simulation is running
- **THEN** the canvas renders a ranking overlay showing each racer's current position (rank number, color dot, name) sorted by distance traveled

#### Scenario: Racer crosses finish line
- **WHEN** a racer's body crosses the finish line boundary
- **THEN** the system records their finishing position (1st, 2nd, ..., 10th), highlights the rank in gold, and displays their assigned team badge (A or B in team color) next to the name

#### Scenario: All racers finish
- **WHEN** all 10 racers have crossed the finish line
- **THEN** the system transitions to the result phase

### Requirement: Team assignment from race result
The system SHALL assign teams based on finishing order: odd positions (1st, 3rd, 5th, 7th, 9th) to Team A, even positions (2nd, 4th, 6th, 8th, 10th) to Team B. The assignment is purely based on the physics simulation result with no balance consideration.

#### Scenario: Teams assigned after race
- **WHEN** all racers have finished and the result phase is shown
- **THEN** the system displays Team A (odd-placed: 1st, 3rd, 5th, 7th, 9th) and Team B (even-placed: 2nd, 4th, 6th, 8th, 10th) with member names

### Requirement: Match confirmation from race result
The system SHALL allow users to confirm the race result as an official match using the existing match creation API. Users SHALL also be able to re-run the race or go back to member selection.

#### Scenario: Confirm match
- **WHEN** user clicks "매치 확정" on the result screen
- **THEN** the system creates a match via the existing createMatch API with the race-determined teams and navigates to history page

#### Scenario: Re-run race
- **WHEN** user clicks "다시 경주" on the result screen
- **THEN** the system starts a new race simulation with the same 10 members

#### Scenario: Go back to selection
- **WHEN** user clicks "돌아가기" on the result screen
- **THEN** the system returns to the member selection phase

### Requirement: Canvas rendering
The system SHALL render the race using Canvas 2D API. Each racer SHALL be visually distinguishable with their member name displayed. The rendering SHALL run at a smooth frame rate (targeting 60fps).

#### Scenario: Racer visual representation
- **WHEN** the race is being rendered
- **THEN** each racer is drawn as a distinct visual element with their member name label visible

#### Scenario: Track visual elements
- **WHEN** the race canvas is displayed
- **THEN** the track shows a clear start line, finish line, and top/bottom boundaries

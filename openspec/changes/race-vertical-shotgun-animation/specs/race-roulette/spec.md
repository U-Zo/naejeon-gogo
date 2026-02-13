## MODIFIED Requirements

### Requirement: Physics-based race simulation
The system SHALL run a 2D physics simulation using Matter.js where each selected member is represented as a racer body. Racers SHALL move from top to bottom on a vertical track (y-increasing direction) with downward gravity (0.3). The simulation SHALL preserve racer momentum with minimal air friction (0.001). At the start, each racer SHALL receive a randomized initial velocity resembling a shotgun blast — varying in angle (center-downward ±60°) and speed (8-20) — to create a scattered, explosive departure from a tightly packed cluster.

#### Scenario: Race starts
- **WHEN** user clicks "경주 시작" with 10 members selected
- **THEN** the system initializes a Matter.js physics world with gravity, 10 racer bodies clustered near the top center of a vertical track, and begins the simulation

#### Scenario: Shotgun-blast start
- **WHEN** the simulation begins
- **THEN** each racer SHALL receive an initial velocity (via setVelocity) with a random angle (center-downward ±60°) and random speed (8-20), causing racers to scatter explosively in different directions

#### Scenario: Momentum-based movement
- **WHEN** the simulation is running
- **THEN** racers SHALL primarily move via preserved momentum from initial impulse, gravity, and obstacle collisions, with only occasional small nudges (every ~1 second) that smoothly drift in direction to maintain natural physics feel

#### Scenario: Stuck racer recovery
- **WHEN** a racer's speed falls below 0.5 during the simulation
- **THEN** the system SHALL immediately apply a strong velocity kick (speed 12, biased downward) to free the racer from obstacles

#### Scenario: Racer collision
- **WHEN** two racers collide during the race
- **THEN** the physics engine resolves the collision with low restitution (0.3) to prevent excessive bouncing

### Requirement: Track boundaries
The system SHALL create static wall boundaries on the left, right, and top edges of the track. The top wall SHALL prevent racers from escaping upward. The bottom of the track (finish line) SHALL have no wall.

#### Scenario: Top wall prevents escape
- **WHEN** a racer is propelled upward by a collision or force
- **THEN** the top wall deflects the racer back downward

### Requirement: Race duration control
The system SHALL ensure each race lasts approximately 30 seconds. If no racer has finished after 45 seconds, the system SHALL apply boost forces to remaining racers to force completion. No early speed limiting SHALL be applied — racers move at full force from the start.

#### Scenario: Normal race duration
- **WHEN** a race is in progress
- **THEN** the race completes within approximately 30 seconds through natural physics progression

#### Scenario: Race exceeds maximum duration
- **WHEN** the race has been running for 45 seconds and racers remain unfinished
- **THEN** the system applies increasing boost forces to remaining racers until all cross the finish line

### Requirement: Responsive track width
The system SHALL set the track width to match the canvas container's actual width, making the race fill the available horizontal space. The track width SHALL be capped at a maximum of 800px to prevent excessive spreading on ultra-wide displays.

#### Scenario: Track width matches container
- **WHEN** a race simulation is initialized
- **THEN** the track width SHALL equal the canvas container's measured width (up to 800px maximum)

#### Scenario: Window resize during race
- **WHEN** the browser window is resized during an active race
- **THEN** the canvas SHALL resize to fit the new container dimensions (track width remains fixed at initialization value)

### Requirement: Camera system
The system SHALL implement a virtual camera that tracks the leading racers. The camera SHALL initially show the entire track (zoomed out) and progressively zoom in on the top 40% of active racers (minimum 3) sorted by progress toward the finish line.

#### Scenario: Initial camera view
- **WHEN** the race begins
- **THEN** the camera shows the full track including all racers at the top and the finish line at the bottom

#### Scenario: Camera follows leaders
- **WHEN** the race is in progress
- **THEN** the camera frames the leading 40% of active racers (minimum 3), zooming in on the front of the pack

#### Scenario: Final racers close-up
- **WHEN** only 2-3 racers remain unfinished
- **THEN** the camera is zoomed in closely on those racers, creating tension for the final team assignment

### Requirement: Finish order tracking
The system SHALL track the order in which racers cross the finish line at the bottom of the track. A finished racer SHALL be removed from the physics world so it does not obstruct remaining racers.

#### Scenario: Racer crosses finish line
- **WHEN** a racer's body position reaches y >= trackLength (bottom of track)
- **THEN** the system records their finishing position (1st, 2nd, ..., 10th), removes the racer body from the physics world, and displays the result

#### Scenario: All racers finish
- **WHEN** all 10 racers have crossed the finish line
- **THEN** the system transitions to the result phase

### Requirement: Canvas rendering
The system SHALL render the race using Canvas 2D API. The start line SHALL be drawn at the top of the track and the finish line at the bottom. Each racer SHALL be visually distinguishable with their member name displayed. The rendering SHALL run at a smooth frame rate (targeting 60fps).

#### Scenario: Track visual elements
- **WHEN** the race canvas is displayed
- **THEN** the track shows a start line at the top, a finish line with checkerboard pattern at the bottom, left/right wall boundaries, and a top wall boundary

#### Scenario: Racer visual representation
- **WHEN** the race is being rendered
- **THEN** each racer is drawn as a distinct visual element with their member name label visible

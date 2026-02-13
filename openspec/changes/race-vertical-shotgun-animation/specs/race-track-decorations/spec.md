## ADDED Requirements

### Requirement: Track obstacle objects
The system SHALL generate a set of physical obstacle objects distributed along the race track at simulation initialization. Obstacles SHALL be static Matter.js bodies that racers collide with, causing direction changes and speed variations. Obstacles SHALL be arranged in a density gradient: sparse near the start, dense near the finish line to enable late-race reversals.

#### Scenario: Obstacles generated at race start
- **WHEN** a new race simulation is initialized
- **THEN** the system generates obstacles across three zones: ~6 in the top zone (0-40% of track), ~10 in the middle zone (40-70%), and ~18 in the bottom zone (70-100%), with minimum spacing of 55px between obstacles to prevent impassable clusters

#### Scenario: Obstacle types
- **WHEN** obstacles are generated
- **THEN** each obstacle SHALL be one of: bumper (circle), wall (rectangle with random angle), or spinner (triangle with random rotation)

#### Scenario: Bottom zone reversal design
- **WHEN** obstacles are placed in the bottom 30% of the track
- **THEN** they SHALL be larger in size and have higher restitution (0.5-0.6) compared to upper obstacles (0.2-0.3), creating a gauntlet zone where leading racers may be slowed and trailing racers can catch up

#### Scenario: Obstacles participate in physics
- **WHEN** a racer's physics body collides with an obstacle
- **THEN** the obstacle SHALL deflect the racer according to Matter.js collision physics with reduced restitution to prevent excessive bouncing

#### Scenario: Obstacles rendered on canvas
- **WHEN** the race canvas is rendered each frame
- **THEN** all obstacles within the camera viewport SHALL be drawn after the track background but before the racer sprites

### Requirement: Obstacle visual appearance
Each obstacle type SHALL have a distinct visual representation rendered via Canvas 2D API.

#### Scenario: Bumper rendering
- **WHEN** a bumper obstacle is rendered
- **THEN** it SHALL appear as a red circle with an outer glow and center dot

#### Scenario: Wall rendering
- **WHEN** a wall obstacle is rendered
- **THEN** it SHALL appear as an orange/yellow rectangle with hazard stripe pattern, rotated to match its physics angle

#### Scenario: Spinner rendering
- **WHEN** a spinner obstacle is rendered
- **THEN** it SHALL appear as a cyan triangle matching its physics body vertices

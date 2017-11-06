within LineFollower.Components;
block CalculateSensorPosition
  extends Modelica.Blocks.Interfaces.BlockIcon;
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  import Modelica.Blocks.Interfaces.RealInput;
  import Modelica.Blocks.Interfaces.IntegerInput;
  import Modelica.Blocks.Interfaces.RealOutput;
  parameter Real lf_positions[2] = {-0.006, 0.065};
  Real rotated_x;
  Real rotated_y;
  RealInput robot_state[4]
    annotation (Placement(transformation(extent={{-140,-20},{-100,20}})));
  RealOutput sensor_position[2]
    annotation (Placement(transformation(extent={{100,-10},{120,10}})));
equation
    rotated_x = lf_positions[1] * cos(robot_state[4]) - lf_positions[2] * sin(robot_state[4]);
    rotated_y = lf_positions[1] * sin(robot_state[4]) + lf_positions[2] * cos(robot_state[4]);
    sensor_position[1] = robot_state[1] + rotated_x;
    sensor_position[2] = robot_state[2] + rotated_y;
  annotation(Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end CalculateSensorPosition;

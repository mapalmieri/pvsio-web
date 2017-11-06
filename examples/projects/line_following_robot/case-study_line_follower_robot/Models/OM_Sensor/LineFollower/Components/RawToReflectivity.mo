within LineFollower.Components;
block RawToReflectivity
  extends Modelica.Blocks.Interfaces.BlockIcon;
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  parameter Real lo_input = -16777216;
  parameter Real hi_input = -1;
  parameter Real lo_output = 0.1;
  parameter Real hi_output = 0.9;
  //input from map
  Modelica.Blocks.Interfaces.RealInput raw_map_reading annotation (Placement(transformation(extent={{-140,-20},{-100,20}})));
  Modelica.Blocks.Interfaces.RealOutput reflectivity annotation (Placement(transformation(extent={{100,-10},{120,10}})));
equation
  reflectivity = hi_output - (hi_input - raw_map_reading) / (hi_input - lo_input) * (hi_output - lo_output);
  annotation(Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end RawToReflectivity;

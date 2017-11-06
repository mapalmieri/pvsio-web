within LineFollower.Components;
block ResponseDelay
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  import Modelica.Blocks.Interfaces.RealInput;
  import Modelica.Blocks.Interfaces.RealOutput;
  RealInput i;
  RealOutput o;
  Modelica.Blocks.Continuous.Integrator integrator1(initType = Modelica.Blocks.Types.Init.SteadyState, y_start = 0, y(start = 0, fixed = true)) annotation(Placement(visible = true, transformation(origin = {2, 10}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Gain gain1 annotation(Placement(visible = true, transformation(origin = {-44, 12}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  PlusMinus plusminus1 annotation(Placement(visible = true, transformation(origin = {-24, 50}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
equation
  connect(i, plusminus1.i);
  connect(plusminus1.o, gain1.i);
  connect(gain1.o, integrator1.u);
  connect(integrator1.y, plusminus1.i2);
  connect(integrator1.y, o);
  annotation(Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end ResponseDelay;

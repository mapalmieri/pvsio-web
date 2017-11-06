within LineFollower.Components;
block AmbientLight
  extends Modelica.Blocks.Interfaces.BlockIcon;
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  Real reflected_power;
  parameter Real led_power = 5.0;
  parameter Real rx_power_off = 0.5;
  parameter Real rx_power_on = 4.5;
  parameter Real ambient_light = 0;
  Modelica.Blocks.Interfaces.RealInput i
    annotation (Placement(transformation(extent={{-140,-20},{-100,20}})));
  Modelica.Blocks.Interfaces.RealOutput o
    annotation (Placement(transformation(extent={{100,-10},{120,10}})));
equation
  reflected_power = (led_power + ambient_light) * i;
  o = if reflected_power <= rx_power_off then 0 else if reflected_power >= rx_power_on then 1 else (reflected_power - rx_power_off) / (rx_power_on - rx_power_off);
  annotation(Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end AmbientLight;

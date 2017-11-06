within LineFollower.Examples;

model SensorBlock2
  parameter Real lf_position_x = -0.01;
  parameter Real lf_position_y = 0.065;
  Modelica.Blocks.Interfaces.RealInput robot_x annotation(Placement(visible = true, transformation(origin = {-100, 70}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-92, 50}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput robot_y annotation(Placement(visible = true, transformation(origin = {-100, 30}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-92, 20}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput robot_z annotation(Placement(visible = true, transformation(origin = {-100, -30}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-92, -22}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealInput robot_theta annotation(Placement(visible = true, transformation(origin = {-100, -70}, extent = {{-20, -20}, {20, 20}}, rotation = 0), iconTransformation(origin = {-92, -72}, extent = {{-20, -20}, {20, 20}}, rotation = 0)));
  Modelica.Blocks.Interfaces.RealOutput lf_1_sensor_reading annotation(Placement(visible = true, transformation(origin = {108, 2}, extent = {{-10, -10}, {10, 10}}, rotation = 0), iconTransformation(origin = {108, -2}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Components.Sensor sensor1(
    calculate_sensor_position1(lf_positions = {lf_position_x, lf_position_y}))
      annotation(Placement(visible = true, transformation(origin = {2, 2}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
equation
  connect(sensor1.sensor_output, lf_1_sensor_reading) annotation(Line(points={{13,2},{
          108,2}},                                                                                  color = {0, 0, 127}));
  connect(robot_theta, sensor1.robot_state[4]) annotation(Line(points={{-100,
          -70},{-66,-70},{-66,-70},{-40,-70},{-40,2},{-10,2},{-10,3.5}},                                                                               color = {0, 0, 127}));
  connect(robot_z, sensor1.robot_state[3]) annotation(Line(points={{-100,-30},{
          -48,-30},{-48,2},{-10,2},{-10,2.5}},                                                                             color = {0, 0, 127}));
  connect(robot_y, sensor1.robot_state[2]) annotation(Line(points={{-100,30},{
          -48,30},{-48,2},{-10,2},{-10,1.5}},                                                                            color = {0, 0, 127}));
  connect(robot_x, sensor1.robot_state[1]) annotation(Line(points={{-100,70},{
          -40,70},{-40,2},{-10,2},{-10,0.5}},                                                                            color = {0, 0, 127}));
  annotation(uses(Modelica(version = "3.2.1")));
end SensorBlock2;

within LineFollower.Components;
model Robot
  extends Modelica.Blocks.Interfaces.BlockIcon;
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  import Modelica.Blocks.Interfaces.RealInput;
  import Modelica.Blocks.Interfaces.RealOutput;
  import .LineFollower.Components.Sensor;
  //input and outputs
  //Real robot_state[4] = {0.138, -0.08, 0, 0};
  RealInput robot_state[4] annotation (Placement(transformation(extent={{-120,-10},
            {-100,10}}), iconTransformation(extent={{-120,-10},{-100,10}})));
  Sensor sensor1 annotation(Placement(visible = true, transformation(origin={0,60},      extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Sensor sensor2 annotation(Placement(visible = true, transformation(origin={0,30},      extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Sensor sensor3 annotation(Placement(visible = true, transformation(origin={0,0},     extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Sensor sensor4 annotation(Placement(visible = true, transformation(origin={0,-30},    extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Sensor sensor5 annotation(Placement(visible = true, transformation(origin={0,-60},    extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  RealOutput sensor_value[5]
    annotation (Placement(transformation(extent={{100,-10},{120,10}})));
  Modelica.Blocks.Routing.Multiplex5 multiplex5
    annotation (Placement(transformation(extent={{60,-10},{80,10}})));
equation
  //Connect Inputs
  connect(robot_state, sensor1.robot_state) annotation (Line(
      points={{-110,0},{-56,0},{-56,60},{-12,60}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(robot_state, sensor2.robot_state) annotation (Line(
      points={{-110,0},{-56,0},{-56,30},{-12,30}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(robot_state, sensor3.robot_state) annotation (Line(
      points={{-110,0},{-60,0},{-60,0},{-12,0}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(robot_state, sensor4.robot_state) annotation (Line(
      points={{-110,0},{-56,0},{-56,-30},{-12,-30}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(robot_state, sensor5.robot_state) annotation (Line(
      points={{-110,0},{-56,0},{-56,-60},{-12,-60}},
      color={0,0,127},
      smooth=Smooth.None));
  //Connect Outputs
  connect(multiplex5.y, sensor_value)
    annotation (Line(points={{81,0},{110,0}}, color={0,0,127}));
  connect(sensor1.sensor_output, multiplex5.u1[1]) annotation (Line(points={{11,
          60},{46,60},{46,10},{58,10}}, color={0,0,127}));
  connect(sensor2.sensor_output, multiplex5.u2[1])
    annotation (Line(points={{11,30},{40,30},{40,5},{58,5}}, color={0,0,127}));
  connect(sensor3.sensor_output, multiplex5.u3[1])
    annotation (Line(points={{11,0},{34,0},{58,0}}, color={0,0,127}));
  connect(sensor4.sensor_output, multiplex5.u4[1]) annotation (Line(points={{11,
          -30},{40,-30},{40,-5},{58,-5}}, color={0,0,127}));
  connect(sensor5.sensor_output, multiplex5.u5[1]) annotation (Line(points={{11,
          -60},{46,-60},{46,-10},{58,-10}}, color={0,0,127}));
  annotation(experiment(StartTime = 0, StopTime = 60), Icon(coordinateSystem(extent={{-100,
            -100},{100,100}},                                                                                     preserveAspectRatio=false,  initialScale = 0.1, grid = {2, 2}),
        graphics={Bitmap(extent={{-82,-82},{82,78}}, fileName=
              "modelica://LineFollower/Resources/Images/robot.jpg")}),                                                          Diagram(coordinateSystem(extent={{-100,
            -100},{100,100}},                                                                                                    preserveAspectRatio=false,  initialScale = 0.1, grid = {2, 2})));
end Robot;

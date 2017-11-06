within LineFollower.Examples;
model TestSensor
  extends Modelica.Icons.Example;
  Components.Sensor sensor
    annotation (Placement(transformation(extent={{40,10},{60,30}})));
  Modelica.Blocks.Sources.Constant const_y(k=0)
    annotation (Placement(transformation(extent={{-80,20},{-60,40}})));
  Modelica.Blocks.Continuous.Integrator integrator_x
    annotation (Placement(transformation(extent={{-40,60},{-20,80}})));
  Modelica.Blocks.Sources.Constant const_x(k=0.01)
    annotation (Placement(transformation(extent={{-80,60},{-60,80}})));
  Modelica.Blocks.Sources.Constant const_theta(k=0)
    annotation (Placement(transformation(extent={{-80,-60},{-60,-40}})));
  Modelica.Blocks.Sources.Constant const_z(k=0)
    annotation (Placement(transformation(extent={{-80,-20},{-60,0}})));
  Modelica.Blocks.Interfaces.RealOutput sensor_output
    annotation (Placement(transformation(extent={{100,10},{120,30}})));
equation
  connect(const_x.y, integrator_x.u) annotation (Line(
      points={{-59,70},{-42,70}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(integrator_x.y, sensor.robot_state[1]) annotation (Line(
      points={{-19,70},{10,70},{10,18.5},{38,18.5}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(const_z.y, sensor.robot_state[3]) annotation (Line(
      points={{-59,-10},{-10,-10},{-10,20.5},{38,20.5}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(const_theta.y, sensor.robot_state[4]) annotation (Line(
      points={{-59,-50},{-10,-50},{-10,21.5},{38,21.5}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(const_y.y, sensor.robot_state[2]) annotation (Line(
      points={{-59,30},{-10,30},{-10,19.5},{38,19.5}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(sensor.sensor_output, sensor_output) annotation (Line(
      points={{61,20},{110,20}},
      color={0,0,127},
      smooth=Smooth.None));
  annotation (experiment(StartTime = 0, StopTime = 60),
          Icon(coordinateSystem(preserveAspectRatio=false, extent={{-100,-100},
            {100,100}})),             Diagram(coordinateSystem(
          preserveAspectRatio=false, extent={{-100,-100},{100,100}}), graphics));
end TestSensor;

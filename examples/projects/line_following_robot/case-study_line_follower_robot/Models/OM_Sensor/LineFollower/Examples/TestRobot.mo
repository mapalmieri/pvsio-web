within LineFollower.Examples;
model TestRobot
  extends Modelica.Icons.Example;
  Components.Robot robot annotation (Placement(transformation(extent={{20,-30},{80,30}})));
  Modelica.Blocks.Sources.Sine robot_y(freqHz=0.1)
    annotation (Placement(transformation(extent={{-60,0},{-40,20}})));
  Modelica.Blocks.Sources.Constant robot_theta(k=0)
    annotation (Placement(transformation(extent={{-60,-80},{-40,-60}})));
  Modelica.Blocks.Continuous.Integrator robot_x annotation (Placement(visible=
          true, transformation(
        origin={-50,50},
        extent={{-10,-10},{10,10}},
        rotation=0)));
  Modelica.Blocks.Sources.Constant const1(k = 0.01) annotation(Placement(visible = true, transformation(origin={-90,50},    extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  Modelica.Blocks.Sources.Constant robot_z(k=0)
    annotation (Placement(transformation(extent={{-60,-50},{-40,-30}})));
  Modelica.Blocks.Interfaces.RealOutput sensor_value[5]
    annotation (Placement(transformation(extent={{100,-10},{120,10}})));
  Modelica.Blocks.Routing.Multiplex4 robot_state
    annotation (Placement(transformation(extent={{-12,-10},{8,10}})));
equation
  connect(const1.y, robot_x.u)
    annotation (Line(points={{-79,50},{-62,50}}, color={0,0,127}));
  connect(robot.sensor_value, sensor_value) annotation (Line(
      points={{83,0},{110,0}},
      color={0,0,127},
      smooth=Smooth.None));
  connect(robot_x.y, robot_state.u1[1]) annotation (Line(points={{-39,50},{-18,
          50},{-18,9},{-14,9}}, color={0,0,127}));
  connect(robot_y.y, robot_state.u2[1]) annotation (Line(points={{-39,10},{-20,
          10},{-20,3},{-14,3}}, color={0,0,127}));
  connect(robot_z.y, robot_state.u3[1]) annotation (Line(points={{-39,-40},{-20,
          -40},{-20,-3},{-14,-3}}, color={0,0,127}));
  connect(robot_theta.y, robot_state.u4[1]) annotation (Line(points={{-39,-70},
          {-18,-70},{-18,-9},{-14,-9}}, color={0,0,127}));
  connect(robot_state.y, robot.robot_state)
    annotation (Line(points={{9,0},{17,0}}, color={0,0,127}));
  annotation(experiment(StartTime = 0, StopTime = 60), Icon(coordinateSystem(extent={{-100,
            -100},{100,100}},                                                                                     preserveAspectRatio=false,  initialScale = 0.1, grid = {2, 2})),
                                                                                                                                Diagram(coordinateSystem(extent={{-100,
            -100},{100,100}},                                                                                                    preserveAspectRatio=false,  initialScale = 0.1, grid = {2, 2})));
end TestRobot;

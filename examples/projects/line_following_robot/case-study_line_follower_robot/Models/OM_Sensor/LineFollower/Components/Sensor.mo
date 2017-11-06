within LineFollower.Components;
block Sensor
  extends Modelica.Blocks.Interfaces.BlockIcon;
  function getResource
    output String r;
  protected
    String s;
  algorithm
    s := Modelica.Utilities.Files.loadResource("modelica://LineFollower/Resources/Data/map.txt");
    r := s;
    // annotation(__ModelicaAssociation_Impure=true, Inline=false);
  end getResource;

  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  import Modelica.Blocks.Interfaces.RealInput;
  import Modelica.Blocks.Interfaces.RealOutput;
  //parameter String fileNameMapTable(fixed = false) = getResource() "File with map data" annotation(Evaluate=false);
  // Dymola doesn't like the fixed=false modifier; Is the modifier needed for OM?
  parameter String fileNameMapTable = getResource() "File with map data" annotation(Evaluate=false);

  RealInput robot_state[4] annotation (Placement(transformation(extent={{-140,-20},
            {-100,20}}),iconTransformation(extent={{-140,-20},{-100,20}})));
  RealOutput sensor_output annotation(Placement(transformation(extent={{100,-10},
            {120,10}}), iconTransformation(extent={{100,-10},{120,10}})));
  RawToReflectivity raw_to_reflectivity1 annotation (Placement(visible=true,
        transformation(
        origin={-14,0},
        extent={{-10,-10},{10,10}},
        rotation=0)));
  AmbientLight ambient_light1 annotation (Placement(visible=true,
        transformation(
        origin={18,0},
        extent={{-10,-10},{10,10}},
        rotation=0)));
  PercentageTo8BitValue percentageto8bitvalue1 annotation(Placement(visible = true, transformation(origin={52,0},      extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  AD_8bit ad_8bit1 annotation(Placement(visible = true, transformation(origin={82,0},      extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  //response_delay response_delay1 annotation(Placement(visible = true, transformation(origin = {36, -6}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  CalculateSensorPosition calculate_sensor_position1
    annotation (Placement(visible=true, transformation(
        origin={-78,0},
        extent={{-10,-10},{10,10}},
        rotation=0)));
  Modelica.Blocks.Tables.CombiTable2D combitable2d1(tableOnFile = true, fileName = fileNameMapTable, tableName = "map") annotation(Placement(visible = true, transformation(origin={-44,0},     extent = {{-10, -10}, {10, 10}}, rotation = 0)));
equation
  connect(robot_state, calculate_sensor_position1.robot_state)
    annotation (Line(points={{-120,0},{-90,0}}, color={0,0,127}));
  connect(calculate_sensor_position1.sensor_position[2], combitable2d1.u1)
    annotation (Line(points={{-67,0.5},{-64,0.5},{-64,6},{-56,6}},color={0,0,127}));
  connect(calculate_sensor_position1.sensor_position[1], combitable2d1.u2)
    annotation (Line(points={{-67,-0.5},{-64,-0.5},{-64,-6},{-56,-6}},color={0,0,127}));
  connect(combitable2d1.y, raw_to_reflectivity1.raw_map_reading)
    annotation (Line(points={{-33,0},{-26,0}},         color={0,0,127}));
  connect(raw_to_reflectivity1.reflectivity, ambient_light1.i)
    annotation (Line(points={{-3,0},{6,0}},       color={0,0,127}));
  //connect(ambient_light1.o, response_delay1.i);
  //connect(response_delay1.o, percentageto8bitvalue1.i);
  connect(ambient_light1.o, percentageto8bitvalue1.i)
    annotation (Line(points={{29,0},{34.5,0},{40,0}}, color={0,0,127}));
  connect(percentageto8bitvalue1.o, ad_8bit1.i)
    annotation (Line(points={{63,0},{70,0}},          color={0,0,127}));
  //connect output
  connect(ad_8bit1.o, sensor_output)
    annotation (Line(points={{93,0},{110,0}}, color={0,0,127}));
  annotation(experiment(StartTime = 0, StopTime = 60), Diagram(coordinateSystem(extent={{-100,
            -100},{100,100}},                                                                                        preserveAspectRatio=false,  initialScale = 0.1, grid = {2, 2})),
    Icon(coordinateSystem(preserveAspectRatio=false, extent={{-100,-100},{100,100}}),
        graphics={Bitmap(extent={{-84,-74},{80,68}}, fileName="modelica://LineFollower/Resources/Images/rodentia-icons_utilities-system-sensors-800px.png")}));
end Sensor;

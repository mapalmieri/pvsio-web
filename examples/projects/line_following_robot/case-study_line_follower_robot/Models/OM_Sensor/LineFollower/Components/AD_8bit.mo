within LineFollower.Components;
block AD_8bit
  extends Modelica.Blocks.Interfaces.BlockIcon;
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  Modelica.Blocks.Interfaces.RealInput i
    annotation (Placement(transformation(extent={{-140,-20},{-100,20}})));
  Modelica.Blocks.Interfaces.RealOutput o
    annotation (Placement(transformation(extent={{100,-10},{120,10}})));
  AD_8bitBlock ad_8bitblock1 annotation(Placement(visible = true, transformation(origin = {30, 20}, extent = {{-10, -10}, {10, 10}}, rotation = 0)));
  //inner Modelica_Noise.Blocks.Noise.GlobalSeed globalSeed annotation(Placement(transformation(extent = {{-20, 40}, {0, 60}})));
  //Modelica_Noise.Blocks.Noise.GenericNoise genericNoise(samplePeriod = 0.02, redeclare function distribution = Modelica_Noise.Math.Distributions.Uniform.quantile(y_min = -1, y_max = 3)) annotation(Placement(transformation(extent = {{-60, 20}, {-40, 40}})));
equation
  connect(i, ad_8bitblock1.i);
  //connect(genericNoise1.y, ad_8bitblock1.noise);
  connect(ad_8bitblock1.o, o);
  annotation(Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end AD_8bit;

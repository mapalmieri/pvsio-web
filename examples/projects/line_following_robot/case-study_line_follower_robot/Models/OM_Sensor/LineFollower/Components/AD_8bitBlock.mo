within LineFollower.Components;
block AD_8bitBlock
  //Author: Mark D. Jackson - m.jackson3@ncl.ac.uk
  //Date  : 28/10/2015
  import Modelica.Blocks.Interfaces.RealInput;
  import Modelica.Blocks.Interfaces.RealOutput;
  import Modelica.Math.*;
  parameter Real bits = 8;
  parameter Real minimum = 0;
  parameter Real maximum = 255;
  parameter Real bitPower = 2 ^ bits;
  Integer noise_level = 0;
  Real hold_signal, windowed_signal, quantisized_signal;
  Real lsb, half_lsb;
  Real noise_value;
  RealInput i;
  //temporarily ommitted due to crash
  //RealInput noise;
  Real noise = 1;
  RealOutput o;
  //initial equation
  //o = 255;
equation
  lsb = (maximum - minimum) / (bitPower - 1);
  noise_value = 2 ^ noise_level * lsb;
  half_lsb = lsb / 2;
  hold_signal = i + noise_value * noise;
  windowed_signal = if hold_signal <= minimum then minimum + half_lsb else if hold_signal >= maximum then maximum - half_lsb else hold_signal;
  quantisized_signal = if windowed_signal < 0.0 then windowed_signal - half_lsb else windowed_signal + half_lsb;
  o = quantisized_signal - mod(quantisized_signal, lsb);
  annotation(experiment(StartTime = 0, StopTime = 8), Icon(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})), Diagram(coordinateSystem(extent = {{-100, -100}, {100, 100}}, preserveAspectRatio = true, initialScale = 0.1, grid = {2, 2})));
end AD_8bitBlock;

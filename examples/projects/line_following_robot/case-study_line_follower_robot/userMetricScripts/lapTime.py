import csv,os, sys, json, io, math

def getColumnFor(colName, row):
  index = 0
  for thisName in row:
    if thisName.strip() == colName.strip():
      return index
    else:
      index +=1   
  return index

def writeObjectiveToOutfile(key, val):
  parsed_json = {}
  print key,val
  if os.path.isfile(objectivesFile):
    json_data = open(objectivesFile)
    parsed_json = json.load(json_data)

    parsed_json[key] = val

    dataString = json.dumps(parsed_json, sort_keys=True,indent=4, separators=(',', ': '))

    with io.open(objectivesFile, 'w', encoding='utf-8') as f:
      f.write(unicode(dataString))

def loadCSV(f):
  with open(f, 'rU') as infile:
    # read the file as a dictionary for each row ({header : value})
    reader = csv.DictReader(infile)
    data = {}
    for row in reader:
      for header, value in row.items():
        try:
          data[header.strip()].append(float(value))
        except KeyError:
          data[header.strip()] = [float(value)]
    return data 

def inStartBox(xPos, yPos):
	if xPos >= parsed_json['startBox']['x1'] and xPos <= parsed_json['startBox']['x2'] and yPos >= parsed_json['startBox']['y1'] and yPos <= parsed_json['startBox']['y2']:
		return True
	else:
		return False
	
def inMidwayBox(xPos, yPos):
	if xPos >= parsed_json['midwayBox']['x1'] and xPos <= parsed_json['midwayBox']['x2'] and yPos >= parsed_json['midwayBox']['y1'] and yPos <= parsed_json['midwayBox']['y2']:
		return True
	else:
		return False
		
		
resultsFileName = "results.csv"
resultsFile = sys.argv[1] + os.path.sep + resultsFileName
objectivesFileName = "objectives.json"
objectivesFile = sys.argv[1] + os.path.sep + objectivesFileName
objectiveName = sys.argv[2]
#scenarioDataFolder = sys.argv[4]
#scenarioDataFolder = 'C:\\Users\\ncjg5\\Dropbox\\Shares\\CarlRiffShare\\0.0.3_0.0.4_environment\\userMetricScripts\\studentMap'
#scenarioDataFolder = 'D:\\Dropbox\\Dropbox\\Shares\\CarlRiffShare\\0.0.3_0.0.4_environment\\userMetricScripts\\studentMap'
#scenarioDataFolder = '/Users/ncjg5/Dropbox/Shares/CarlRiffShare/0.0.3_0.0.4_environment/userMetricScripts/studentMap'
scenarioDataFolder = sys.argv[3]
time = sys.argv[4]
xcol = sys.argv[5]
ycol = sys.argv[6]

results = loadCSV(resultsFile)
ts = results[time][1:]
xs = results[xcol][1:]
ys = results[ycol][1:]

json_data = open(scenarioDataFolder + os.path.sep + "lapTime.json")
parsed_json = json.load(json_data)

started = False
startTime = 0.0
midwayReached = False
completed = False



for i in range(len(xs) - 1):
	if inStartBox(xs[i],ys[i]) and not started:
		startTime = ts[i]
		print ('startTime')
		print startTime
		started = True
		
	if inMidwayBox(xs[i],ys[i]) and started and not midwayReached:
		midwayReached = True

	if inStartBox(xs[i],ys[i]) and started and midwayReached and not completed:
		lapTime = ts[i] - startTime
		writeObjectiveToOutfile(objectiveName, lapTime)
		completed = True
		
if not completed:	
	writeObjectiveToOutfile(objectiveName, 45)
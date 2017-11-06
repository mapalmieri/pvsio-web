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
    
resultsFileName = "results.csv"
resultsFile = sys.argv[1] + os.path.sep + resultsFileName
objectivesFileName = "objectives.json"
objectivesFile = sys.argv[1] + os.path.sep + objectivesFileName
objectiveName = sys.argv[2]
scenarioDataFolder = sys.argv[3]
energy = sys.argv[4]

results = loadCSV(resultsFile)
writeObjectiveToOutfile(objectiveName, results[energy][-1])
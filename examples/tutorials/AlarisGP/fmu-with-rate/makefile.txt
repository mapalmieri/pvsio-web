CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -fPIC -shared -o AlarisGPFMI.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto -pthread
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv AlarisGPFMI.so binaries/linux64/
	zip -r AlarisGPFMI.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run3:
	./fmuCheck.linux64 -h 1E-03 AlarisGPFMI.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 AlarisGPFMI.fmu

clean:
	rm -rf  AlarisGPFMI.o fmu.o skeleton.o

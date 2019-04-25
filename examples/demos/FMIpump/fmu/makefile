CC=g++-8
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++-8 -fPIC -Wall -c fmu.cpp
	g++-8 -fPIC -Wall -c skeleton.cpp
	g++-8 -fPIC -shared -o AlarisGPFMI.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto -pthread
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
	cp /usr/lib/x86_64-linux-gnu/libwebsockets.so.7 binaries/linux64/
	zip -r AlarisGPFMI.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run2:
	./fmuCheck.linux64 -h 1E-02 AlarisGPFMI.fmu
run3:
	./fmuCheck.linux64 -h 1E-03 AlarisGPFMI.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 AlarisGPFMI.fmu

here:   
	./fmuCheck.linux64 -z fmi -h 1E-02 AlarisGPFMI.fmu

clean:
	rm -rf  AlarisGPFMI.o fmu.o skeleton.o

CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -shared -o VisualDrones.so skeleton.o fmu.o  -lwebsockets -lssl -lcrypto
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv VisualDrones.so binaries/linux64/
	cp /usr/lib/x86_64-linux-gnu/libwebsockets.so.7 binaries/linux64/
	zip -r VisualDrones.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	

run:
	./fmuCheck.linux64 -h 1E-03 VisualDrones.fmu
run1:
	./fmuCheck.linux64 -h 1E-04 VisualDrones.fmu

clean:
	rm -rf  VisualDrones.o fmu.o skeleton.o

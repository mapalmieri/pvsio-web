CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -shared -o coordination.so skeleton.o fmu.o  -lwebsockets -lssl -lcrypto
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv coordination.so binaries/linux64/
	zip -r coordination.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run:
	./fmuCheck.linux64 -h 1E-01 coordination.fmu
run1:
	./fmuCheck.linux64 -h 1E-04 coordination.fmu

clean:
	rm -rf  coordination.o fmu.o skeleton.o

CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -fPIC -shared -o x_coverage.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto -pthread
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv x_coverage.so binaries/linux64/
	zip -r x_coverage.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run3:
	./fmuCheck.linux64 -h 1E-03 x_coverage.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 x_coverage.fmu

clean:
	rm -rf  x_coverage.o fmu.o skeleton.o

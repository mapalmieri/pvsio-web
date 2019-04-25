CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -fPIC -shared -o Radical7.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto -pthread
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv Radical7.so binaries/linux64/
	cp /usr/lib/x86_64-linux-gnu/libwebsockets.so.7 binaries/linux64/
	zip -r Radical7.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	

run2:
	./fmuCheck.linux64 -h 1E-02 Radical7.fmu
run3:
	./fmuCheck.linux64 -h 1E-03 Radical7.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 Radical7.fmu

here:   
	./fmuCheck.linux64 -z fmi -h 1E-02 Radical7.fmu

clean:
	rm -rf  Radical7.o fmu.o skeleton.o

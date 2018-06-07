CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	g++ -fPIC -Wall -c fmu.cpp
	g++ -fPIC -Wall -c skeleton.cpp
	g++ -fPIC -shared -o line_following_robot1.so skeleton.o fmu.o -Wl,-rpath,. -lwebsockets -lssl -lcrypto
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.cpp sources
	cp skeleton.cpp sources
	mv line_following_robot1.so binaries/linux64/
	cp /usr/local/lib/libwebsockets.so.11 binaries/linux64/
	zip -r line_following_robot1.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run3:
	./fmuCheck.linux64 -h 1E-03 line_following_robot1.fmu
run4:
	./fmuCheck.linux64 -h 1E-04 line_following_robot1.fmu

clean:
	rm -rf  line_following_robot1.o fmu.o skeleton.o

CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	gcc -fPIC -Wall -c fmu.c
	gcc -fPIC -Wall -c skeleton.c
	gcc -fPIC -Wall -c misraC/LFR_environment.c
	cp resources/libwebsockets.* .
	cp resources/libcrypto.so.* .
	cp resources/libssl.so.* .
	gcc -fPIC -shared -o LFR_environment.so skeleton.o fmu.o LFR_environment.o -Wl,-rpath,. -L. -lwebsockets
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*
	rm -rf sources
	rm -rf binaries
	mkdir sources
	mkdir  binaries
	mkdir binaries/linux64
	cp fmu.h sources
	cp FmuGUID.h sources
	cp fmu.c sources
	cp skeleton.c sources
	rm -f misraC/main.c
	cp -r misraC sources
	cp -r fmi sources
	mv LFR_environment.so binaries/linux64/
	cp resources/libwebsockets.* binaries/linux64/
	cp resources/libcrypto.so.* binaries/linux64/
	cp resources/libssl.so.* binaries/linux64/
	zip -r LFR_environment.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run:
	cp resources/libwebsockets.* .
	cp resources/libcrypto.so.* .
	cp resources/libssl.so.* .
	./fmuCheck.linux64 -h 1E-01 LFR_environment.fmu
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*
run1:
	cp resources/libwebsockets.* .
	cp resources/libcrypto.so.* .
	cp resources/libssl.so.* .
	./fmuCheck.linux64 -h 1E-02 LFR_environment.fmu
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*

clean:
	rm -rf  LFR_environment.o fmu.o skeleton.o

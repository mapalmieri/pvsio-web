CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	gcc -fPIC -Wall -c fmu.c
	gcc -fPIC -Wall -c skeleton.c
	gcc -fPIC -Wall -c misraC/line_following_robot_4S.c
	unzip -o resources/libWS.zip
	gcc -fPIC -shared -o line_following_robot_4S.so skeleton.o fmu.o line_following_robot_4S.o -Wl,-rpath,. -L. -lwebsockets 
	
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
	mv line_following_robot_4S.so binaries/linux64/
	cp libwebsockets.* binaries/linux64/
	cp libcrypto.so.* binaries/linux64/
	cp libssl.so.* binaries/linux64/
	zip -r line_following_robot_4S.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*

run:
	unzip -o resources/libWS.zip
	./fmuCheck.linux64 -h 1E-01 line_following_robot_4S.fmu
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*
run1:
	unzip -o resources/libWS.zip
	./fmuCheck.linux64 -h 1E-02 line_following_robot_4S.fmu
	rm libwebsockets.*
	rm libcrypto.so.*
	rm libssl.so.*

clean:
	rm -rf  line_following_robot_4S.o fmu.o skeleton.o

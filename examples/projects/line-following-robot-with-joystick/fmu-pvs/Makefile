CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	gcc -fPIC -Wall -c fmu.c
	gcc -fPIC -Wall -c skeleton.c
	gcc -fPIC -Wall -c misraC/line-following-robot-with-joystick.c
	gcc -shared -o line-following-robot-with-joystick.so skeleton.o fmu.o line-following-robot-with-joystick.o -lwebsockets -lssl -lcrypto
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
	mv line-following-robot-with-joystick.so binaries/linux64/
	zip -r line-following-robot-with-joystick.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run:
	./fmuCheck.linux64 -h 1E-01 line-following-robot-with-joystick.fmu
run1:
	./fmuCheck.linux64 -h 1E-02 line-following-robot-with-joystick.fmu

clean:
	rm -rf  line-following-robot-with-joystick.o fmu.o skeleton.o

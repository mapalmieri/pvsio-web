CC=gcc
CFLAGS=-I.

%.o: %.c
	$(CC) -c -o $@ $< $(CFLAGS)
all:
	gcc -fPIC -Wall -c fmu.c
	gcc -fPIC -Wall -c skeleton.c
	gcc -fPIC -Wall -c misraC/line_following_robot1.c
	gcc -shared -o line_following_robot1.so skeleton.o fmu.o line_following_robot1.o -lwebsockets -lssl -lcrypto
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
	mv line_following_robot1.so binaries/linux64/
	zip -r line_following_robot1.fmu modelDescription.xml binaries/ resources/ sources/
	rm -rf sources
	rm -rf binaries

run:
	./fmuCheck.linux64 -h 1E-01 line_following_robot1.fmu
run1:
	./fmuCheck.linux64 -h 1E-02 line_following_robot1.fmu

clean:
	rm -rf  line_following_robot1.o fmu.o skeleton.o

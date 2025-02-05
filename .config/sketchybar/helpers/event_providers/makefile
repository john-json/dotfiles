all:
	(cd cpu_load && $(MAKE))
	(cd network_load && $(MAKE))

	
BINARY_NAME = apple_menu
FRAMEWORKS = -framework Cocoa -framework SwiftUI -framework MediaPlayer -framework CoreAudio -framework CoreBluetooth -framework IOKit

bin/$(BINARY_NAME): apple_menu.swift | bin
	swiftc $< $(FRAMEWORKS) -o $@

bin:
	mkdir -p bin

clean:
	rm -rf bin

.PHONY: clean 
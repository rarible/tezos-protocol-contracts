EXCHANGE=../../contracts/exchange.arl
TRANSFER_MANAGER=../../contracts/transfer_manager.arl
TARLS=$(shell ls *.tarl)
ARLS=$(TARLS:.tarl=.arl)

%.arl : %.tarl
	cat $(EXCHANGE) $^ > $@

all: $(ARLS)

clean:
	-rm -f *.arl

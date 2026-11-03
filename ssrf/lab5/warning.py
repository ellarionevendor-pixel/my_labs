import sys

def Warning():
    print("[WARNING] This program in studing porpouses only! (Type 'OK' if you realize that)")
            
    Agreement = str(input("> "))
    if Agreement != "OK":
        print("Good for You ^ ^")
        sys.exit(-1)
    return

def Check():
    if len(sys.argv) != 2:
        print("[INFO]\npython3 payload.py <url to exploit>")
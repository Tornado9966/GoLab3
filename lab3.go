package main

import (
    "fmt"
    "strings"
    "os"
    "io/ioutil"
    "strconv"
    "log"
	"regexp"
)

var counter = 0

func SplitAny(s string, seps string) []string {
    splitter := func(r rune) bool {
        return strings.ContainsRune(seps, r)
    }
    return strings.FieldsFunc(s, splitter)
}

func lab3(filetemp os.FileInfo, pwd string) {
    var countWords = 0
	var bufSize int = 1000
	var words []string
	var IsLetter = regexp.MustCompile(`^[A-Za-z]+$`).MatchString
	var IsPunctuation = regexp.MustCompile(`^[.,:;?!-]+$`).MatchString
	var IsSymbol = regexp.MustCompile(`^[' \t\n\r]+$`).MatchString

    file, err := os.Open(pwd + SplitAny(os.Args[1], ".")[0] + "/" + filetemp.Name())
    if err != nil {
		log.Fatal(err)
    } 
	
	data := make([]byte, bufSize)
	dataPrev := make([]byte, bufSize)
    for {
        n, err := file.Read(data)
        if err != nil {
            break
        }
        
		var prev = string(dataPrev[n - 1])
		var next = string(data[0])
		
		for a := 0; a < n; a++ {
			if (!IsLetter(string(data[a])) && (!IsSymbol(string(data[a])))) {
				data[a] = []byte(" ")[0]
			}
		}
		
        words = SplitAny(string(data[:n]), " \t\n\r")
        countWords += len(words)
		
		for i := 0; i < (n - 2); i++ {
			if (string(data[i]) == " " && IsPunctuation(string(data[i+1])) && string(data[i+2]) == " ") {
				countWords--
			}
		}
		
		if n == bufSize {
			if countWords != 0 {
				if (!IsSymbol(prev)) && (!IsSymbol(next)) {
					countWords--
				}
			}
		}
		
		dataPrev = data
    }

    if error := os.Chdir(pwd + SplitAny(os.Args[2], ".")[0]); error != nil {
        os.Mkdir(pwd + SplitAny(os.Args[2], ".")[0], 0700)
        if e := os.Chdir(pwd + SplitAny(os.Args[2], ".")[0]); e != nil {
            panic(e)
        }
    }

    var str string = filetemp.Name()
    res, er := os.Create(SplitAny(str, ".")[0] + ".res")

    if er != nil{
        fmt.Println("Unable to create file:", err) 
        os.Exit(1) 
    }

    defer res.Close() 
    res.WriteString(strconv.Itoa(countWords))
    counter++                  
}

func main() {
    var countFiles = 0

    files, err := ioutil.ReadDir(os.Args[1])
    if err != nil {
        log.Fatal(err)
    }

    pwd, err := os.Getwd()
    if err != nil {
        fmt.Println(err)
        os.Exit(1)
    }

    for _, filetemp := range files {            		        	
        go lab3(filetemp, pwd)
        countFiles++	
    }

    for counter != countFiles {}
    fmt.Println("Total number of processed files:", countFiles)
}

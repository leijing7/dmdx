# Convert dmdx and key file to csv file

### Environment
This program uses JavaScript and Node.js to parse the files and save them.

Tested on Ubuntu and OS X.

### How to run

Go to the folder in command line and type:

node src_code/main.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil ./src_data/McGurkKey.xlsx

node src_code/main.js N-NN  Native ./src_data/Ella_NNN-N1.azk NonNative ./src_data/Ella_NNN-NN1.azk ./src_data/N-NNKey.xlsx

### Run this with Docker

#### Mac OS:

1. go to docker.com downloading the docker tool box and install
2. run the docker terminal
3. pull node:0.10 image from the hub:

       docker pull node:0.10

4. run the scripts

  McGurk
       docker run -it --rm --name dmdx-script -v "$PWD":/usr/src/app -w /usr/src/app node:0.10 sh -c "npm install && node src_code/main.js McGurk Clear ./src_data/McGurkClearScript.zil Noise ./src_data/McGurkNoiseScript.zil ./src_data/McGurkKey.xlsx"

 N-NN
        docker run -it --rm --name dmdx-script -v "$PWD":/usr/src/app -w /usr/src/app node:0.10 sh -c "npm install && node src_code/main.js N-NN  Native ./src_data/Ella_NNN-N1.azk NonNative ./src_data/Ella_NNN-NN1.azk ./src_data/N-NNKey.xlsx"
        
5. Then you will get the results in the dst_data dir

### Document

Check the code for detail document.

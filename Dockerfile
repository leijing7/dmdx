FROM node:0.10-onbuild

# Bundle app source
COPY . /src

# Install app dependencies
RUN cd /src; npm install

CMD node src_code/main.js McGurk Clear \
src_data/McGurkClearScript.zil Noise \
src_data/McGurkNoiseScript.zil \
src_data/McGurkKey.xlsx

# CMD node src_code/main.js N-NN  Native \
# ./src_data/Ella_NNN-N1.azk NonNative \
# ./src_data/Ella_NNN-NN1.azk \
# ./src_data/N-NNKey.xlsx

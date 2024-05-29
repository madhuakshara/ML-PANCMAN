import {
  Button,
  InputLabel,
  Select,
  MenuItem,
  FormControl,
  Grid,
  Typography,
  LinearProgress,
} from "@mui/material";
import React from "react";
import { buildModel } from "../model/model";
import {
  controllerDatasetAtom,
  dataFlagAtom,
  emptySetMessageAtom,
  imgSrcArrAtom,
  trainingProgressAtom,
} from "../App";
import { useAtom } from "jotai";
import {
  lossAtom,
  modelAtom,
  truncatedMobileNetAtom,
  epochsAtom,
  batchSizeAtom,
  learningRateAtom,
  hiddenUnitsAtom,
} from "../App";

function generateSelectComponent(label, options, handleChange, currentValue) {
  return (
    <>
      <InputLabel id="demo-simple-select-label">{label}</InputLabel>
      <Select
        size="small"
        sx={{ minWidth: 120 }}
        labelId="demo-simple-select-label"
        id="demo-simple-select"
        value={currentValue}
        label={label}
        onChange={(e) => handleChange(e.target.value)}
      >
        {options.map((option) => (
          <MenuItem value={option}>{option}</MenuItem>
        ))}
      </Select>
    </>
  );
}

export default function MLTrain() {
  const [learningRate, setLearningRate] = useAtom(learningRateAtom);
  const [epochs, setEpochs] = useAtom(epochsAtom);
  const [batchSize, setBatchSize] = useAtom(batchSizeAtom);
  const [hiddenUnits, setHiddenUnits] = useAtom(hiddenUnitsAtom);
  const [imgSrcArr] = useAtom(imgSrcArrAtom);

  const [lossVal, setLossVal] = useAtom(lossAtom);
  const [_, setModel] = useAtom(modelAtom);
  const [truncatedMobileNet] = useAtom(truncatedMobileNetAtom);
  const [controllerDataset] = useAtom(controllerDatasetAtom);
  const [dataFlag] = useAtom(dataFlagAtom);

  const [emptySetMessage, setEmptySetMessage] = useAtom(emptySetMessageAtom);
  const [trainingProgress] = useAtom(trainingProgressAtom);

  function trainModel() {
    let batchVal = Math.floor(imgSrcArr.length * (parseInt(batchSize) / 100));
    batchVal = batchVal < 1 ? 1 : batchVal;

    !dataFlag
      ? setEmptySetMessage("Please collect some data first!")
      : setModel(
          buildModel(
            truncatedMobileNet,
            setLossVal,
            controllerDataset,
            hiddenUnits,
            batchVal,
            epochs,
            learningRate
          )
        );
  }

  return (
    <Grid container space={2}>
      <Grid item xs={6}>
        <Button
          variant="contained"
          color="primary"
          onClick={() => {
            trainModel();
          }}
        >
          Train
        </Button>
        <LinearProgress
          variant="determinate"
          value={trainingProgress}
          style={{
            display: trainingProgress === 0 ? "none" : "block",
            width: "75%",
            marginTop: "10px",
          }}
        />
        <Typography variant="h6">
          LOSS: {lossVal === null ? "" : lossVal} <br />
          {emptySetMessage}
        </Typography>
      </Grid>
      <Grid item xs={6}>
        <div className="hyper-params">
          {/* <label>Learning rate</label> */}
          {generateSelectComponent(
            "Learning Rate",
            [0.003, 0.001, 0.0001, 0.00001],
            setLearningRate,
            learningRate
          )}

          {/* <label>Epochs</label> */}
          {generateSelectComponent(
            "Epochs",
            [10, 100, 1000],
            setEpochs,
            epochs
          )}

          {/* <label>Batch size </label> */}
          {generateSelectComponent(
            "Batch Size (fraction of the dataset)",
            ["100%", "40%", "10%", "5%"],
            setBatchSize,
            batchSize
          )}

          {/* <label>Hidden units</label> */}
          {generateSelectComponent(
            "Hidden units",
            [10, 100, 200],
            setHiddenUnits,
            hiddenUnits
          )}
        </div>
      </Grid>
    </Grid>
  );
}

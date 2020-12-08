import React, { useState} from "react";
import { cursor } from "@airtable/blocks";
import {
  useLoadable,
  useWatchable,
  useRecordById,
  CellRenderer,
  initializeBlock,
  useBase,
  useRecords,
  Box,
  Label,
  Text,
  Button,
} from "@airtable/blocks/ui";
import printWithoutElementsWithClass from "./print_without_elements_with_class";


function UpdateBlock() {
  // YOUR CODE GOES HERE
  const [selectedRecordId, setSelectedRecordId] = useState("recayQIhqDSufYpWz");
  const [selectedFieldId, setSelectedFieldId] = useState(null);

  useLoadable(cursor);
  //const fields = cursor.selectedFieldIds;
  // re-render whenever the list of selected records or fields changes
  //useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"]);
  useWatchable(cursor, ["selectedRecordIds", "selectedFieldIds"], () => {
    // If the update was triggered by a record being de-selected, the
    // current `selectedRecordId` will be retained. This is what enables
    // the caching described above.
    if (cursor.selectedRecordIds.length > 0) {
      // There might be multiple selected records. We'll use the first
      // one.
      setSelectedRecordId(cursor.selectedRecordIds[0]);
    }
    if (cursor.selectedFieldIds.length > 0) {
      // There might be multiple selected fields. We'll use the first
      // one.
      setSelectedFieldId(cursor.selectedFieldIds[0]);
    }
  });
  useWatchable(cursor, ["activeTableId", "activeViewId"], () => {
    setSelectedRecordId(null);
    setSelectedFieldId(null);
  });
  const base = useBase();

  const table = base.getTableByIdIfExists(cursor.activeTableId);

  const brandTable = base.getTable("Brands");
  const queryResult = brandTable.selectRecords();
  const brandRecords = useRecords(queryResult);

  const records = useRecords(table);
  const selectedRecords = records
    ? records.map((record) =>
        record.id == selectedRecordId ? (
          <Record
            key={record.id}
            table={table}
            brandRecords={brandRecords}
            record={record}
            selectedRecordId={selectedRecordId}
            selectedFieldId={selectedFieldId}
            name={name}
          />
        ) : null
      )
    : null;
  return (
    //<div>{table.name}</div>;)
    <div>{selectedRecords}</div>
  );
}

function Record({
  table,
  record,
  selectedFieldId,
  selectedRecordId,
}) {
  // let patternName = record.getCellValue("Pattern Name");
  const fullWidth = {
    padding: "2%",
    width: "95%",
    border: "solid 1px #fddfcf",
    color: "#1c9de2",
  };
  // We use getFieldByIdIfExists because the field might be deleted.
  const selectedField = selectedFieldId
    ? table.getFieldByIdIfExists(selectedFieldId)
    : null;
  const selectedRecord = useRecordById(
    table,
    selectedRecordId ? selectedRecordId : "",
    {
      fields: [selectedField],
    }
  );

  return (
    <Box
      border="thick"
      display="flex"
      flexDirection="column"
      alignItems="center"
      padding="12"
      fontSize="1.2em"
    >
      <Box
        justifyContent="center"
        padding={2}>
        <img src="https://dl.airtable.com/.attachmentThumbnails/d4347788067ecd0d6ab480e7b2c2a815/35b6043d.png" width="100%" alt="Logo" />
      </Box>
      <Box  backgroundColor="#bababa" height="50px" width="100%" display="flex" flexDirection="row">
        {/*  Brand*/}
        <div 
            style={{ fontSize: "1em", padding: "1% 2%", width:"30%"}}>  
          <a
            textAlign="center"
            style={{ fontSize: "1.5em",fontStyle:"bold" ,padding: "1% 2%", color: "#fff", width:"30%", textDecoration:"none"}}
            width="100%"
            htmlFor="brand"
            href={selectedRecord.getCellValueAsString("url (from Field 14)")}
          >
            {selectedRecord.getCellValueAsString("Brand").toUpperCase()}
          </a>
        </div>

      {/* Pattern name input */}
      <Text
        style={{ fontSize: "1.5em", padding: "1% 2%", color: "#fff" }}
        >{record.name}</Text>
      {/* Type */}
      <Text style={{ fontSize: "1.2em", padding: "1% 5%", color: "#1c9de2" }}>
        {selectedRecord.getCellValueAsString("Type")}
      </Text>

      <Box display="flex" flexDirection="row">
        {/* Designer name */}
        <div>
          <Label textAlign="center" width="100%" htmlFor="Designer">
            {selectedRecord.getCellValueAsString("Designer")}
          </Label>
        </div>

      </Box>
      
        {/*  Skill Level */}
        <div>
          <Label textAlign="center" width="100%" htmlFor="skill">
            {selectedRecord.getCellValueAsString("Skill Level")}
          </Label>
        </div>
      </Box>
      {/* Sizes textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey" marginTop="5%">
        {selectedRecord.getCellValueAsString("Sizes")}
      </Text>

      {/* Materials textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Materials")}
      </Text>

      {/* Gauge textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Gauge")}
      </Text>

      {/* Abbreviations select */}
      <Text size="xlarge" justifyContent="center" textColor="grey">
        Abbreviations
      </Text>
      <CellRenderer
        field={table.getFieldByName("Abbreviations")}
        record={selectedRecord}
      />

      {/* Instructions textarea */}
      <Text size="xlarge" justifyContent="left" textColor="grey">
        {selectedRecord.getCellValueAsString("Instructions")}
      </Text>

      <Box
        className="print-hide"
        padding={2}
        borderBottom="thick"
        display="flex"
      >
        {/* <ViewPickerSynced table={table} globalConfigKey={GlobalConfigKeys.VIEW_ID} /> */}
        <Button
          onClick={() => {
            // Inject CSS to hide elements with the "print-hide" class name
            // when the app gets printed. This lets us hide the toolbar from
            // the print output.
            printWithoutElementsWithClass("print-hide");
          }}
          marginLeft={2}
        >
          Print
        </Button>
      </Box>
    </Box>
  );
}
initializeBlock(() => <UpdateBlock />);

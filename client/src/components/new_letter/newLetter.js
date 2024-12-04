import React, { useState } from "react";
import { TextField, Box, Typography, Button, IconButton } from "@mui/material";
import { Editor, EditorState, RichUtils, ContentState } from "draft-js";
import "draft-js/dist/Draft.css";
import mammoth from "mammoth";
import * as pdfjsLib from "pdfjs-dist/build/pdf";

import FormatBoldIcon from "@mui/icons-material/FormatBold";
import FormatItalicIcon from "@mui/icons-material/FormatItalic";
import FormatUnderlinedIcon from "@mui/icons-material/FormatUnderlined";
import FileUploadIcon from '@mui/icons-material/FileUpload';
import { Save } from "@mui/icons-material";
import SendIcon from '@mui/icons-material/Send';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { AddNewHeader } from "./addNewHeader";
import { AddNewFooter } from "./addNewFooter";
import { AddNewCCs } from "./addNewCCs";
import { AddNewReceivers } from "./addNewReceivers";




pdfjsLib.GlobalWorkerOptions.workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;


// Style button with icons
const StyleButton = ({ style, Icon, onToggle, active }) => (
  <IconButton
    onMouseDown={(e) => {
      e.preventDefault(); // Prevent focus loss
      onToggle(style);
    }}
    color={active ? "primary" : "default"}
    size="small"
    sx={{
      border: active ? "1px solid #1976d2" : "1px solid #ccc",
      borderRadius: 1,
      margin: "0 4px",
    }}
  >
    <Icon sx={{ fontSize: {xs:14, sm:18} }} />
  </IconButton>
);

// Rich text controls with icons
const InlineStyleControls = ({ editorState, onToggle }) => {
  const currentStyle = editorState.getCurrentInlineStyle();
  const styles = [
    { label: "Bold", style: "BOLD", Icon: FormatBoldIcon },
    { label: "Italic", style: "ITALIC", Icon: FormatItalicIcon },
    { label: "Underline", style: "UNDERLINE", Icon: FormatUnderlinedIcon },
  ];

  return (
    <Box sx={{ display: "flex", marginBottom: 2 }}>
      {styles.map((type) => (
        <StyleButton
          key={type.label}
          style={type.style}
          Icon={type.Icon}
          onToggle={onToggle}
          active={currentStyle.has(type.style)}
        />
      ))}
    </Box>
  );
};

export const NewLetter = () => {


  const [formData, setFormData] = useState({
    header: "",
    receivers: "",
    subject: "",
    content: EditorState.createEmpty(), 
    ccs: "",
    footer: "",
  });



 // Handle file upload and set its content in the editor
 const handleFileUpload = (event) => {
  const file = event.target.files[0];
  if (file) {
    const fileType = file.type;

    if (fileType === "text/plain") {
      // Handle .txt files
      const reader = new FileReader();
      reader.onload = (e) => {
        setEditorContent(e.target.result);
      };
      reader.readAsText(file);
    } else if (fileType === "application/pdf") {
      // Handle .pdf files
      const reader = new FileReader();
      reader.onload = async (e) => {
        const typedArray = new Uint8Array(e.target.result);
        const pdf = await pdfjsLib.getDocument(typedArray).promise;
        let text = "";
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const content = await page.getTextContent();
          const pageText = content.items.map((item) => item.str).join(" ");
          text += pageText + "\n";
        }
        setEditorContent(text);
      };
      reader.readAsArrayBuffer(file);
    } else if (
      fileType ===
      "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // Handle .docx files
      const reader = new FileReader();
      reader.onload = async (e) => {
        const result = await mammoth.extractRawText({
          arrayBuffer: e.target.result,
        });
        setEditorContent(result.value);
      };
      reader.readAsArrayBuffer(file);
    } else {
      alert("Unsupported file type. Please upload a .txt, .pdf, or .docx file.");
    }
  }
};

//receive selected header id from child component
const setSelectedHeader = (selectedHeader) =>{
  setFormData((prev) => ({ ...prev, header: selectedHeader.header_id }));
}

//receive selected footer id from child component
const setSelectedFooter = (selectedFooter) =>{
  setFormData((prev) => ({ ...prev, footer: selectedFooter.footer_id }));
}

//receive ccs id from child component
const receivedCcs = (id) =>{
  setFormData((prev) => ({ ...prev, ccs:id }));
}

//receive receivers id from child component
const receivedReceivers = (id) =>{
  setFormData((prev) => ({ ...prev, receivers:id }));
}

// Update the Draft.js editor state with new content
const setEditorContent = (text) => {
    const contentState = ContentState.createFromText(text);
    const newEditorState = EditorState.createWithContent(contentState);
    setFormData({ ...formData, content: newEditorState });
  };

const handleContentChange = (newState) => {
    setFormData({ ...formData, content: newState });
  };

const handleKeyCommand = (command) => {
    const newState = RichUtils.handleKeyCommand(formData.content, command);
    if (newState) {
      handleContentChange(newState);
      return "handled";
    }
    return "not-handled";
  };

const toggleInlineStyle = (style) => {
    handleContentChange(RichUtils.toggleInlineStyle(formData.content, style));
  };

const handleChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value,
    });
  };

const handleSave = () => {
  const content = formData.content.getCurrentContent();
  const contentAsText = content.getPlainText();
    const letter = { 
      header: formData.header, 
      receivers: formData.receivers,
      subject: formData.subject,
      content: contentAsText,
      ccs: formData.ccs,
      footer: formData.footer,
      status:"Draft",
     };

    if(formData.receivers !=="" || formData.subject !== "" || formData.content){
      const token = localStorage.getItem('token'); // Retrieve the token from storage
      
      if(!token){
          console.log('Error: No token');
        }
      fetch("http://localhost:8001/api/letters/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json", 
          'Authorization': `Bearer ${token}`, // Include the JWT token
        },
        credentials: "include",
        body: JSON.stringify(letter),
      })
        .then((response) => response.json())
        .then((data) => {
          console.log("Success:", data);
          toast.success("Letter saved to draft!")
        })
        .catch((error) => {
          console.error("Error:", error);
          toast.error("Failed to create the letter")
        });
      }else{
        toast.error("The letter has empty content or subject")
      }
      
  };


const handleSubmit = () => {
    const content = formData.content.getCurrentContent();
    const contentAsText = content.getPlainText();
      const letter = { 
        header: formData.header, 
        receivers: formData.receivers,
        subject: formData.subject,
        content: contentAsText,
        ccs: formData.ccs,
        footer: formData.footer,
        status:"Pending",
       };
  
      if(formData.receivers !=="" || formData.subject !== "" || formData.content){
        const token = localStorage.getItem('token'); // Retrieve the token from storage
        
        if(!token){
            console.log('Error: No token');
          }
        fetch("http://localhost:8001/api/letters/add", {
          method: "POST",
          headers: {
            "Content-Type": "application/json", 
            'Authorization': `Bearer ${token}`, // Include the JWT token
          },
          credentials: "include",
          body: JSON.stringify(letter),
        })
          .then((response) => response.json())
          .then((data) => {
            console.log("Success:", data);
            toast.success("Letter submited!")
          })
          .catch((error) => {
            console.error("Error:", error);
            toast.error("Failed to create the letter")
          });
        }else{
          toast.error("The letter has empty content or subject")
        }
        
    };

  return (
    <Box sx={{ maxWidth: {xs:"95%", sm:"75%", md:"60%"}, mx: "auto", mt:5, mb:8 }}>
      
      {/* Header */}
      <AddNewHeader sendSelectedHeader={setSelectedHeader}/>

      {/* Receivers */}
      <AddNewReceivers sendReceivers={receivedReceivers}/>

       {/* Subject */}
      <Box>
        <TextField
          fullWidth
          label="Subject"
          variant="outlined"
          size="small"
          value={formData.subject}
          onChange={handleChange("subject")}
          sx={{ mb: 2, mt:2 }}
        />
      </Box>

      {/* Content */}
      <Box>
        <Typography variant="body1" sx={{ mb: 1 }}>
          Content:
        </Typography>
        <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", 
          gap: 2,  
            }}>
          <InlineStyleControls
            editorState={formData.content}
            onToggle={toggleInlineStyle}
          />
          
          {/* File Upload Button */}
          <Button 
            variant="contained" 
            component="label" 
            startIcon={<FileUploadIcon/>}
            sx={{ mb: 2, textTransform:'none' }}>
              Upload from File
              <input
                type="file"
                name="header_logo"
                hidden
                accept=".txt, .pdf, .docx" 
                onChange={handleFileUpload}
              />
          </Button>
        </Box>
        <Box
          sx={{
            border: "1px solid #ccc",
            borderRadius: "4px",
            padding: "10px",
            minHeight: "150px",
          }}
          onClick={() => {
            document.querySelector(".DraftEditor-root").focus();
          }}
        >
          <Editor
            editorState={formData.content}
            onChange={handleContentChange}
            handleKeyCommand={handleKeyCommand}
            placeholder="Type your content here..."
          />
        </Box>
          

      </Box>

      {/* CCs */}
      <AddNewCCs sendCcs={receivedCcs}/>

      {/* Footer */}
      <AddNewFooter sendSelectedFooter={setSelectedFooter}/>

      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between", 
          gap: 2,  
            }}
          >
        <Button 
            startIcon={<Save />}
            onClick={handleSave}
            variant="contained" 
            color="primary" 
            sx={{mt:2, textTransform:'none'}}>
              Save
        </Button>
        <Button 
          variant="contained" 
          color="primary" 
          endIcon={<SendIcon/>}
          sx={{mt:2, textTransform:'none'}}
          onClick={handleSubmit}>
          Submit Letter
        </Button>
      </Box>
    </Box>
  );
};




import { Box, Dialog, DialogContent, DialogActions, Button, Typography, CardMedia, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';
import DownloadOutlinedIcon from '@mui/icons-material/DownloadOutlined';
import PrintOutlinedIcon from '@mui/icons-material/PrintOutlined';
import jsPDF from "jspdf";
import html2canvas from "html2canvas";

const LetterDetailDialog = ({ open, onClose, selectedLetter }) => {

  
  console.log(selectedLetter)
  const officeName = selectedLetter?.office?.office_name;
  if (!selectedLetter) return null;

  
  const handlePrintOrDownload = async (action) => {
    const dialogContent = document.getElementById("printContent"); // Ensure this ID exists in your DialogContent
  
    if (!dialogContent) return;
  
    // Ensure all images are loaded before capturing
    const images = dialogContent.getElementsByTagName("img");
    const promises = Array.from(images).map((img) => {
      if (!img.complete) {
        return new Promise((resolve, reject) => {
          img.onload = resolve;
          img.onerror = reject;
        });
      }
      return Promise.resolve();
    });
  
    await Promise.all(promises);
  
    // Capture content with html2canvas
    const canvas = await html2canvas(dialogContent, {
      scale: 3, // Increase quality
      scrollY: 0, // Ignore page scrolling
      useCORS: true, // Allow cross-origin images
    });
  
    const imgData = canvas.toDataURL("image/png");
    const pdf = new jsPDF("p", "mm", "a4");
  
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;
  
    pdf.addImage(imgData, "PNG", 0, 0, pdfWidth, pdfHeight);
  
    if (action === "print") {
      window.open(pdf.output("bloburl"), "_blank"); // Open PDF in a new tab for printing
    } else if (action === "download") {
      pdf.save("document.pdf");
    }
  };
  


  return (
    <>
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogContent>
        {/* Header section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 92, height: 92, borderRadius: '50%' }}
            image={`http://localhost:8001/${selectedLetter.header.header_logo}`}
            alt=""
          />
          <Typography>{selectedLetter.header.header_title}</Typography>
        </Box>
        <Divider sx={{ pt: 0 }} />

        {/* Number and Date section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'end',
          }}
        >
          <Typography variant="subtitle1">
            <strong>ቁጥር:</strong> {selectedLetter.ref_no}
          </Typography>
          <Typography variant="subtitle1">
            <strong>ቀን:</strong> {selectedLetter.date}
          </Typography>
        </Box>

        {/* For section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'start',
          }}
        >
          <Typography variant="subtitle1">
            <strong>ለ: </strong>
          </Typography>
          {selectedLetter.receiver.receiver_name.map((name, index) => (
            <Typography key={index} variant="subtitle1" sx={{ pl: 2 }}>
              {name}
            </Typography>
          ))}
        </Box>

        {/* Subject section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" component="span">
            <strong>ጉዳዩ:</strong>{' '}
            <Typography component="span" sx={{ textDecoration: 'underline' }}>
              {selectedLetter.subject}
            </Typography>
          </Typography>
        </Box>

        {/* Content section */}
        <Typography variant="body1">{selectedLetter.content}</Typography>

                  {/* Greatting section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'end',
            paddingTop: 3,
          }}
        >
          <Typography variant="subtitle1">
            <strong> ከሰላምታ ጋር </strong>
          </Typography>
        </Box>
          
        {/* approvers section */}
        <Box sx={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'flex-end', flexWrap: 'wrap' }}>
            {selectedLetter.approver && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'row', // Arrange cards horizontally
                  alignItems: 'flex-end',
                  justifyContent: 'flex-end',
                  flexWrap: 'wrap', // Allow cards to wrap to the next row if needed
                  paddingTop: 4,
                }}
              >
                {/* Cards for each Approver */}
                {JSON.parse(selectedLetter.approver.approvers_name).map((name, index) => {
                  const position = selectedLetter.approver.approvers_position[index];
                  return (
                    <Box
                      key={`approver-card-${index}`}
                      sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        alignItems: 'center',
                        justifyContent: 'center',
                        borderRadius: '8px',
                        padding: 2,
                        margin: 1,
                        boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
                      }}
                    >
                      <Typography variant="h6">{name}</Typography>
                      <Typography variant="subtitle2">
                        {(position.trim() === 'Head' && `Head of ${officeName} Department`) ||
                          (position.trim() === 'Manager' && 'Managing Director') ||
                          (position.trim() === 'Executive' && 'Executive Director') ||
                          position}
                      </Typography>
                    </Box>
                  );
                })}
              </Box>
            )}
        </Box>

        {/* CC section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'start',
            paddingTop: 3,
          }}
        >
          <Typography variant="subtitle1">
            <strong>ግልባጭ: </strong>
          </Typography>
          {selectedLetter.cc.ccs_name.map((name, index) => (
            <Typography key={index} variant="subtitle1" sx={{ pl: 2 }}>
              {name}
            </Typography>
          ))}
        </Box>

        {/* Footer section */}
        <Divider sx={{ paddingTop: 3 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.phone && <PhoneIcon />} {selectedLetter.footer.phone}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.email && <EmailIcon />} {selectedLetter.footer.email}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.address && <LocationOnIcon />} {selectedLetter.footer.address}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.website && <LanguageIcon />} {selectedLetter.footer.website}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">{selectedLetter.footer.slogan}</Typography>
          </Box>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button 
          onClick={() => handlePrintOrDownload("print")}
          startIcon={<PrintOutlinedIcon/>}
          sx={{ textTransform: 'none', bgcolor: '#357EC7', color:'white' }}>
          Print
        </Button>
        <Button 
          onClick={() => handlePrintOrDownload("download")}
          startIcon={<DownloadOutlinedIcon/>}
          sx={{ textTransform: 'none', bgcolor: '#357EC7', color:'white' }}>
          Download
        </Button>
        <Button 
          onClick={onClose} 
          sx={{ textTransform: 'none', bgcolor: 'red', color:'white' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
    <Box id="printContent" sx={{pl:8, pr:8, pt:5}}>
        {/* Header section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            p: 0,
          }}
        >
          <CardMedia
            component="img"
            sx={{ width: 92, height: 92, borderRadius: '50%' }}
            image={`http://localhost:8001/${selectedLetter.header.header_logo}`}
            alt=""
          />
          <Typography>{selectedLetter.header.header_title}</Typography>
        </Box>
        <Divider sx={{ pt: 0 }} />

         {/* Number and Date section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'end',
            justifyContent: 'end',
          }}
        >
          <Typography variant="subtitle1">
            <strong>ቁጥር:</strong> {selectedLetter.ref_no}
          </Typography>
          <Typography variant="subtitle1">
            <strong>ቀን:</strong> {selectedLetter.date}
          </Typography>
        </Box>

        {/* For section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'start',
          }}
        >
          <Typography variant="subtitle1">
            <strong>ለ: </strong>
          </Typography>
          {selectedLetter.receiver.receiver_name.map((name, index) => (
            <Typography key={index} variant="subtitle1" sx={{ pl: 2 }}>
              {name}
            </Typography>
          ))}
        </Box>

        {/* Subject section */}
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'center',
          }}
        >
          <Typography variant="subtitle1" component="span">
            <strong>ጉዳዩ:</strong>{' '}
            <Typography component="span" sx={{ textDecoration: 'underline' }}>
              {selectedLetter.subject}
            </Typography>
          </Typography>
        </Box>

        {/* Content section */}
        <Typography variant="body1">{selectedLetter.content}</Typography>

        {/* Greatting section */}
        <Box
          sx={{
            display: 'flex',
            alignItems: 'end',
            justifyContent: 'end',
            paddingRight:4,
            paddingTop: 3,
          }}
        >
          <Typography variant="subtitle1">
            <strong> ከሰላምታ ጋር </strong>
          </Typography>
        </Box>

        {/* CC section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'start',
            justifyContent: 'start',
            paddingTop: 20,
          }}
        >
          <Typography variant="subtitle1">
            <strong>ግልባጭ: </strong>
          </Typography>
          {selectedLetter.cc.ccs_name.map((name, index) => (
            <Typography key={index} variant="subtitle1" sx={{ pl: 2 }}>
              {name}
            </Typography>
          ))}
        </Box>

        {/* Footer section */}
        <Divider sx={{ paddingTop: 3 }} />
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Box>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.phone && <PhoneIcon />} {selectedLetter.footer.phone}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.email && <EmailIcon />} {selectedLetter.footer.email}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.address && <LocationOnIcon />} {selectedLetter.footer.address}
            </Typography>
            <Typography variant="body2" sx={{ display: 'inline', mx: 1 }}>
              {selectedLetter.footer.website && <LanguageIcon />} {selectedLetter.footer.website}
            </Typography>
          </Box>
          <Box>
            <Typography variant="body2">{selectedLetter.footer.slogan}</Typography>
          </Box>
        </Box>
    </Box>
  
  </>
  );
};

export default LetterDetailDialog;

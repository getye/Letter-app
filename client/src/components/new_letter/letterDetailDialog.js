import React from 'react';
import { Box, Dialog, DialogContent, DialogActions, Button, Typography, CardMedia, Divider } from '@mui/material';
import PhoneIcon from '@mui/icons-material/Phone';
import EmailIcon from '@mui/icons-material/Email';
import LocationOnIcon from '@mui/icons-material/LocationOn';
import LanguageIcon from '@mui/icons-material/Language';

const LetterDetailDialog = ({ open, onClose, selectedLetter }) => {
  if (!selectedLetter) return null;

  return (
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
        <Button onClick={onClose} sx={{ textTransform: 'none', color: 'red' }}>
          Close
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default LetterDetailDialog;

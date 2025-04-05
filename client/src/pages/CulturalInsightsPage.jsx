import React, { useState, useEffect, useContext } from 'react';
import {
  Container,
  Typography,
  Box,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  TextField,
  CircularProgress,
  Alert,
  Divider,
  Paper,
  Chip,
  Collapse,
  useTheme
} from '@mui/material';
import { getCulturalInsights } from '../utils/api';
import { DarkModeContext } from '../contexts/DarkModeContext';

// Mock insights data
const mockInsights = {
  'Pipili Applique Work': 'Pipili Applique Work is a traditional craft form from the town of Pipili in Odisha, known for its vibrant colors and intricate designs. This art form involves cutting and stitching pieces of colored cloth onto a base fabric to create decorative patterns. The craft is particularly famous for its use in making decorative items like umbrellas, wall hangings, and ceremonial items. The artisans, known as "Darjis," use bright, contrasting colors and geometric patterns, often incorporating motifs inspired by nature and religious themes. The craft has been practiced for centuries and is an important part of Odisha\'s cultural heritage. Today, Pipili Applique Work has gained international recognition and is used in both traditional and contemporary applications, from temple decorations to modern fashion accessories.',
  
  'Sambalpuri Sarees': 'Sambalpuri Sarees are exquisite handwoven sarees from the Sambalpur region of Odisha, known for their unique ikat patterns and traditional designs. The art of weaving these sarees dates back to the 12th century and is practiced by the Meher community. The distinctive feature of Sambalpuri sarees is the "Bandha" (tie and dye) technique, where threads are tied and dyed before weaving to create intricate patterns. The sarees feature traditional motifs like flowers, animals, and geometric patterns, often in earthy colors. The weaving process is labor-intensive, with each saree taking several weeks to complete. The craft has received Geographical Indication (GI) status, recognizing its unique regional identity. Today, Sambalpuri sarees are prized possessions and are worn on special occasions throughout India.',
  
  'Odissi Dance': 'Odissi is one of the eight classical dance forms of India, originating from the state of Odisha. It has a history spanning over 2,000 years, with evidence found in archaeological remains from the 2nd century BCE. The dance form is characterized by its tribhangi posture (where the body is bent in three parts - head, bust, and torso), distinctive mudras (hand gestures), and elaborate costumes. Odissi performances typically depict themes from Hindu mythology, especially those related to Lord Jagannath and Lord Krishna. The dance is accompanied by Odissi music, which has its own unique ragas and talas. In the mid-20th century, Guru Kelucharan Mohapatra played a pivotal role in reviving and popularizing Odissi dance. Today, it is performed worldwide and is recognized as a sophisticated classical dance form that beautifully combines rhythm, music, and expressive storytelling.',
  
  'Pattachitra Art': 'Pattachitra is a traditional cloth-based scroll painting that originated in Odisha and is one of the oldest and most popular art forms of the region. The name comes from Sanskrit words "patta" meaning cloth and "chitra" meaning picture. These paintings are characterized by their colorful application, creative motifs, and designs, and portrayal of simple themes, mostly mythological in depiction. The colors used in Pattachitra are natural and the process of preparing them is quite elaborate. The painters, known as "Chitrakaras," traditionally use only natural colors derived from conch shells, stones, and vegetables. The most common themes of Pattachitra paintings are related to Lord Jagannath and the Vaishnava cult. The Raghurajpur village in Puri district is famous for this art form and has been declared a heritage village. Today, Pattachitra has gained international recognition, and efforts are being made to preserve this ancient art form for future generations.',
  
  'Jagannath Culture': 'The Jagannath culture is central to the religious and cultural identity of Odisha. Lord Jagannath, considered an incarnation of Lord Vishnu, is worshipped along with his siblings Balabhadra and Subhadra at the famous Jagannath Temple in Puri. The temple, built in the 12th century, is one of the Char Dham pilgrimage sites for Hindus. The most distinctive feature of Jagannath worship is the annual Rath Yatra (chariot festival), where the deities are placed on elaborately decorated chariots and pulled through the streets of Puri by devotees. The term "juggernaut" in English derives from this festival. The iconography of Lord Jagannath is unique, with large circular eyes and incomplete limbs, representing the cosmic form of the deity. The temple follows elaborate rituals, with a complex system of priests (sevayats) who perform specific duties. The Jagannath culture promotes inclusivity, as the temple\'s prasad (sacred food) is shared by all, transcending caste barriers. This culture has influenced literature, art, music, and dance forms of Odisha, making it an integral part of Odia identity.',
  
  'Odia Cuisine': 'Odia cuisine is known for its subtle flavors, minimal use of oil, and emphasis on fresh ingredients. Rice is the staple food, typically served with a variety of dalma (lentil preparations), vegetables, and fish curries. The cuisine is less spicy compared to other Indian regional cuisines but rich in flavors. One of the most famous dishes is "Dalma," a preparation of lentils and vegetables. Seafood plays a significant role in Odia cuisine due to the state\'s long coastline, with dishes like "Machha Jhola" (fish curry) being popular. The cuisine also includes a variety of sweets like "Rasagola" (which has a geographical indication tag), "Chhena Poda" (cheese dessert), and "Khaja." Temple food, particularly the Mahaprasad of Jagannath Temple in Puri, is an important aspect of Odia cuisine. It consists of 56 items (Chhappan Bhog) cooked in earthen pots. Odia cuisine also has a tradition of preserving seasonal foods, like bamboo shoots and various pickles, to be enjoyed throughout the year.',
  
  'Rath Yatra Festival': 'Rath Yatra, also known as the Chariot Festival, is one of the most ancient and largest religious festivals in India, celebrated annually in Puri, Odisha. The festival commemorates Lord Jagannath\'s annual visit to his birthplace and his aunt\'s temple, the Gundicha Temple. During this nine-day festival, the deities Lord Jagannath, his brother Balabhadra, and sister Subhadra leave their abode in the Jagannath Temple and travel to the Gundicha Temple, about 3 kilometers away. They are transported on three huge, elaborately decorated chariots, which are pulled by thousands of devotees. The main chariot of Lord Jagannath stands at 45 feet high and has 16 wheels. The festival attracts millions of pilgrims and tourists from around the world. It is believed that those who participate in pulling the chariots receive immense spiritual merit. On the return journey, known as Bahuda Yatra, the deities stop at the Mausi Maa Temple (Aunt\'s temple) to partake in offering of the Poda Pitha (a sweet pancake). The festival concludes with the deities returning to the main temple.',
  
  'Kalinga Temple Architecture': 'The Kalinga style of temple architecture is a distinct architectural style that developed in the ancient region of Kalinga, which corresponds to modern-day Odisha. This architectural tradition dates back to the 7th-8th century CE and reached its zenith during the 11th-13th centuries under the Eastern Ganga Dynasty. Kalinga temples typically consist of two main structures: the Deul (sanctum with curvilinear spire) and the Jagamohana (assembly hall with pyramidal roof). More elaborate temples may include additional structures like the Natamandapa (dance hall) and Bhogamandapa (offering hall). The temples are known for their intricate carvings, sculptural excellence, and erotic sculptures similar to those found in Khajuraho. The most famous examples of Kalinga architecture include the Lingaraja Temple in Bhubaneswar, the Jagannath Temple in Puri, and the Sun Temple at Konark, which is designed as a massive chariot with 12 pairs of wheels pulled by seven horses. The Konark Sun Temple, a UNESCO World Heritage site, represents the culmination of Kalinga temple architecture, showcasing extraordinary craftsmanship and artistic vision.'
};

const CulturalInsightsPage = () => {
  const [culturalTopics, setCulturalTopics] = useState([]);
  const [selectedTopic, setSelectedTopic] = useState(null);
  const [insight, setInsight] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { darkMode } = useContext(DarkModeContext);
  const theme = useTheme();

  useEffect(() => {
    fetchCulturalInsights();
  }, []);

  const fetchCulturalInsights = async () => {
    try {
      setLoading(true);
      const { data } = await getCulturalInsights();
      setCulturalTopics(data);
      setError(null);
    } catch (error) {
      console.error('Error fetching cultural insights:', error);
      setError('Failed to load cultural insights. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const handleTopicSelect = async (topic) => {
    try {
      if (selectedTopic && selectedTopic.topic === topic) {
        setSelectedTopic(null);
        setInsight('');
        return;
      }

      setLoading(true);
      setError(null);
      const selectedItem = culturalTopics.find(item => item.topic === topic);
      
      if (!selectedItem) {
        setError('Topic not found');
        setLoading(false);
        return;
      }
      
      setSelectedTopic(selectedItem);
      setInsight(selectedItem.insight || '');
      setLoading(false);
      
      // Scroll to the selected card after a short delay to allow for render
      setTimeout(() => {
        const element = document.getElementById(`topic-${topic}`);
        if (element) {
          element.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
      }, 100);
    } catch (error) {
      console.error('Error fetching cultural insight:', error);
      setError('Failed to load cultural insight. Please try again later.');
      setLoading(false);
    }
  };

  if (loading && !culturalTopics.length) {
    return (
      <Box sx={{ 
        display: 'flex', 
        justifyContent: 'center', 
        alignItems: 'center', 
        minHeight: '60vh',
        bgcolor: darkMode ? '#121212' : '#f5f5f5',
        color: darkMode ? '#e0e0e0' : 'inherit',
      }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box sx={{ 
      minHeight: '100vh', 
      bgcolor: darkMode ? '#121212' : '#f5f5f5',
      color: darkMode ? '#e0e0e0' : 'inherit',
      pt: 4, 
      pb: 8,
      backgroundImage: darkMode 
        ? 'linear-gradient(rgba(20, 20, 30, 0.9), rgba(20, 20, 30, 0.95)), url(https://images.unsplash.com/photo-1605542589761-fad56c6420d5?q=80&w=2070)'
        : 'linear-gradient(rgba(245, 245, 245, 0.9), rgba(245, 245, 245, 0.95)), url(https://images.unsplash.com/photo-1605542589761-fad56c6420d5?q=80&w=2070)',
      backgroundSize: 'cover',
      backgroundPosition: 'center',
      backgroundAttachment: 'fixed'
    }}>
      <Container maxWidth="xl">
        <Paper 
          elevation={0} 
          sx={{ 
            p: 4, 
            mb: 4, 
            bgcolor: darkMode ? '#1e1e2d' : 'rgba(255, 255, 255, 0.9)',
            borderRadius: 2,
            backdropFilter: 'blur(10px)',
            color: darkMode ? '#e0e0e0' : 'inherit',
          }}
        >
          <Typography variant="h4" component="h1" gutterBottom sx={{ mb: 4, fontWeight: 'bold', borderBottom: 1, borderColor: 'divider', pb: 2, color: darkMode ? '#e0e0e0' : 'inherit' }}>
            Cultural Insights
          </Typography>

          <Typography variant="subtitle1" sx={{ mb: 4, color: darkMode ? '#a0a0a0' : 'text.secondary' }} paragraph>
            Explore the rich cultural heritage of Odisha. Click on any topic to view detailed information and gallery.
          </Typography>

          {loading && !culturalTopics.length ? (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '200px' }}>
              <CircularProgress />
            </Box>
          ) : error && !culturalTopics.length ? (
            <Alert severity="error" sx={{ mb: 3 }}>
              {error}
            </Alert>
          ) : (
            <>
              <Grid container spacing={3}>
                {culturalTopics.map((topic) => (
                  <Grid item xs={12} key={topic.topic} id={`topic-${topic.topic}`}>
                    <Card 
                      sx={{ 
                        cursor: 'pointer',
                        transition: 'all 0.3s ease',
                        '&:hover': {
                          transform: 'translateY(-4px)',
                          boxShadow: darkMode ? '0 8px 16px rgba(255, 255, 255, 0.1)' : 6
                        },
                        border: selectedTopic?.topic === topic.topic ? '2px solid' : 'none',
                        borderColor: 'primary.main',
                        bgcolor: darkMode ? '#2a2a3c' : '#ffffff',
                        color: darkMode ? '#e0e0e0' : 'inherit',
                        mb: 2,
                        display: 'flex',
                        flexDirection: { xs: 'column', md: 'row' },
                        overflow: 'hidden',
                        borderRadius: 2
                      }}
                      onClick={() => handleTopicSelect(topic.topic)}
                    >
                      <Box sx={{ display: 'flex', width: '100%' }}>
                        <Box sx={{ width: { xs: '100%', md: '30%' } }}>
                          <CardMedia
                            component="img"
                            sx={{ 
                              height: { xs: '200px', md: '240px' },
                              width: '100%',
                              objectFit: 'cover',
                              filter: darkMode ? 'brightness(0.85)' : 'none'
                            }}
                            image={topic.image}
                            alt={topic.title}
                          />
                        </Box>
                        <Box sx={{ 
                          width: { xs: '100%', md: '70%' },
                          display: 'flex', 
                          flexDirection: 'column',
                          p: 3
                        }}>
                          <Box sx={{ flex: 1 }}>
                            <Typography gutterBottom variant="h5" component="h2" sx={{ fontWeight: 'bold', color: darkMode ? '#e0e0e0' : 'inherit' }}>
                              {topic.title}
                            </Typography>
                            <Typography 
                              variant="body2" 
                              sx={{ 
                                mb: 2, 
                                display: '-webkit-box', 
                                WebkitLineClamp: 3, 
                                WebkitBoxOrient: 'vertical', 
                                overflow: 'hidden', 
                                textOverflow: 'ellipsis',
                                color: darkMode ? '#a0a0a0' : 'text.secondary'
                              }}
                            >
                              {topic.description.substring(0, 150)}...
                            </Typography>
                          </Box>
                          <Box>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 1, mb: 1 }}>
                              {topic.tags?.map((tag) => (
                                <Chip 
                                  key={tag} 
                                  label={tag} 
                                  size="small"
                                  sx={{ 
                                    bgcolor: darkMode ? '#3a3a4a' : '#f0f0f0',
                                    color: darkMode ? '#e0e0e0' : 'inherit'
                                  }}
                                />
                              ))}
                            </Box>
                            <Typography 
                              variant="caption" 
                              sx={{ 
                                display: 'block', 
                                textAlign: 'right', 
                                mt: 1,
                                fontStyle: 'italic',
                                color: darkMode ? '#a0a0a0' : 'text.secondary'
                              }}
                            >
                              Click to explore
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
                    </Card>

                    <Collapse in={selectedTopic?.topic === topic.topic} timeout="auto" unmountOnExit>
                      <Paper 
                        elevation={0} 
                        sx={{ 
                          p: 3, 
                          mb: 3, 
                          bgcolor: darkMode ? '#2a2a3a' : 'grey.50', 
                          borderRadius: 2,
                          borderTop: '4px solid',
                          borderColor: 'primary.main',
                          color: darkMode ? '#e0e0e0' : 'inherit'
                        }}
                      >
                        {loading && (
                          <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                            <CircularProgress />
                          </Box>
                        )}
                        
                        {error && !loading && (
                          <Alert severity="error" sx={{ my: 2 }}>{error}</Alert>
                        )}
                        
                        {selectedTopic && !loading && !error && (
                          <>
                            <Typography variant="body1" paragraph sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                              {selectedTopic.description || 'No description available'}
                            </Typography>
                            
                            <Box sx={{ mb: 3 }}>
                              <Typography variant="h6" gutterBottom sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                                Gallery
                              </Typography>
                              <Grid container spacing={2}>
                                <Grid item xs={12} sm={4}>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      overflow: 'hidden',
                                      borderRadius: 2,
                                      height: 200,
                                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={selectedTopic.imageGallery?.[0] || 'https://via.placeholder.com/400x300?text=Gallery+Image+1'}
                                      alt={`${selectedTopic.title} - Gallery Image 1`}
                                      sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        filter: darkMode ? 'brightness(0.85)' : 'none',
                                        '&:hover': {
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    />
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      overflow: 'hidden',
                                      borderRadius: 2,
                                      height: 200,
                                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={selectedTopic.imageGallery?.[1] || 'https://via.placeholder.com/400x300?text=Gallery+Image+2'}
                                      alt={`${selectedTopic.title} - Gallery Image 2`}
                                      sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        filter: darkMode ? 'brightness(0.85)' : 'none',
                                        '&:hover': {
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    />
                                  </Paper>
                                </Grid>
                                <Grid item xs={12} sm={4}>
                                  <Paper
                                    elevation={0}
                                    sx={{
                                      overflow: 'hidden',
                                      borderRadius: 2,
                                      height: 200,
                                      bgcolor: darkMode ? 'rgba(255, 255, 255, 0.05)' : 'rgba(0, 0, 0, 0.04)'
                                    }}
                                  >
                                    <Box
                                      component="img"
                                      src={selectedTopic.imageGallery?.[2] || 'https://via.placeholder.com/400x300?text=Gallery+Image+3'}
                                      alt={`${selectedTopic.title} - Gallery Image 3`}
                                      sx={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover',
                                        transition: 'transform 0.3s ease',
                                        filter: darkMode ? 'brightness(0.85)' : 'none',
                                        '&:hover': {
                                          transform: 'scale(1.05)'
                                        }
                                      }}
                                    />
                                  </Paper>
                                </Grid>
                              </Grid>
                            </Box>
                            
                            <Typography variant="body1" paragraph sx={{ color: darkMode ? '#e0e0e0' : 'inherit' }}>
                              {insight || 'No insight available'}
                            </Typography>
                            <Typography variant="caption" sx={{ color: darkMode ? '#a0a0a0' : 'text.secondary' }}>
                              Note: This content is generated by AI and may not be 100% accurate. Please verify important information from official sources.
                            </Typography>
                          </>
                        )}
                        
                        {!selectedTopic && !loading && !error && (
                          <Alert severity="info">No content selected</Alert>
                        )}
                      </Paper>
                    </Collapse>
                  </Grid>
                ))}
              </Grid>
            </>
          )}
        </Paper>
      </Container>
    </Box>
  );
};

export default CulturalInsightsPage; 
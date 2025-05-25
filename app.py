import streamlit as st
from agents import HealthAdvisor
import os
from dotenv import load_dotenv
import time

# Load environment variables
load_dotenv()

def main():
    # Set page configuration
    st.set_page_config(
        page_title="AI Health Advisor",
        page_icon="❤️",
        layout="wide",
        initial_sidebar_state="expanded"
    )
    
    def load_css(file_name):
      with open(file_name) as f:
        st.markdown(f"<style>{f.read()}</style>", unsafe_allow_html=True)
      
      
    # Load the css file
    load_css("style.css")
    
   
    
    # Header
    st.markdown('<h1 class="main-header">👨‍⚕️AI powered Health Advisor</h1>', unsafe_allow_html=True)
    st.markdown('<p class="sub-header">Your personal health insights from blood marker reports</p>', unsafe_allow_html=True)
    
    # Main content
    st.markdown('<div class="info-box">', unsafe_allow_html=True)
    st.markdown("""
    ### Welcome to Your Personal Health Analysis!
    
    Upload your blood test report below, and I'll help you understand your results in simple, everyday language.
    You'll receive personalized recommendations for improving your health through diet and exercise.
    """)
    st.markdown('</div>', unsafe_allow_html=True)
    
    # Check if API key is configured
    if not os.getenv("OPENAI_API_KEY"):
        st.error("""
        ⚠️ **Configuration Error**: OpenAI API Key is not set.
        
        Please add your OpenAI API key to your .env file:
        ```
        OPENAI_API_KEY=your_api_key_here
        ```
        """)
        return
    
    # File upload with custom styling
    st.markdown("### 📄 Upload Your Blood Marker Report")
    uploaded_file = st.file_uploader(
        label="Blood Marker Report", 
        type=['pdf'], 
        help="Upload your blood test report in PDF format",
        label_visibility="collapsed"
    )
    
    if uploaded_file is not None:
        # Show file details
        file_details = {
            "Filename": uploaded_file.name,
            "File size": f"{uploaded_file.size / 1024:.2f} KB",
            "File type": uploaded_file.type
        }
        st.write("### 📋 File Details")
        for key, value in file_details.items():
            st.write(f"**{key}:** {value}")
        
        # Analysis button
        if st.button("🔍 Analyze My Blood Report"):
            with st.spinner("Analyzing your blood marker report... This may take a minute."):
                # Initialize and use the HealthAdvisor
                advisor = HealthAdvisor()
                analysis = advisor.analyze(uploaded_file)
                
                # Display results with animation
                st.markdown('<div class="result-box">', unsafe_allow_html=True)
                st.markdown("### 📊 Analysis Results")
                
                # Animate the text appearance
                for line in analysis.split('\n'):
                    st.markdown(line)
                    time.sleep(0.1)
                
                st.markdown('</div>', unsafe_allow_html=True)
                
                # Download button for the analysis
                st.download_button(
                    label="📥 Download Analysis",
                    data=analysis,
                    file_name="health_advisor_analysis.pdf",
                    mime="text/plain"
                )
    
    # Footer with disclaimer
    st.markdown('<div class="disclaimer">', unsafe_allow_html=True)
    st.markdown("""
    ⚠️ **Important Note**: This analysis is for informational purposes only and should not replace 
    professional medical advice. Please consult with your healthcare provider for proper medical guidance.
    """)
    st.markdown('</div>', unsafe_allow_html=True)

if __name__ == "__main__":
    main()

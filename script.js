let uploadedImage;

document.querySelector('input[type="file"]').addEventListener('change', e => {
  const file = e.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = () => {
      const img = document.getElementById('preview');
      img.src = reader.result;
      img.classList.remove('hidden');
      uploadedImage = file;
    };
    reader.readAsDataURL(file);
  }
});

async function applyFilter(type) {
  if (!uploadedImage) {
    alert("Upload an image first!");
    return;
  }

  const formData = new FormData();
  formData.append('image', uploadedImage);

  try {
    const response = await fetch('https://api.deepai.org/api/colorizer', {
      method: 'POST',
      headers: {
        'Api-Key': 'd8fcb611-b522-4409-a9df-e15bb305f61f' 
      },
      body: formData
    });

    const data = await response.json();
    console.log("API Response:", data);
    alert(JSON.stringify(data, null, 2)); // Debug alert

    if (data.output_url) {
      document.getElementById('preview').src = data.output_url;
    } else if (data.err || data.error) {
      alert("DeepAI Error: " + (data.err || data.error));
    } else {
      alert("API didn't return a valid image URL.");
    }

  } catch (error) {
    console.error('Error applying filter:', error);
    alert('Something went wrong with the API request. Check console for details.');
  }
}

document.addEventListener('DOMContentLoaded', function() {
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const previewContainer = document.getElementById('previewContainer');
    const controlPanel = document.getElementById('controlPanel');
    const qualitySlider = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const downloadBtn = document.getElementById('downloadBtn');
    
    let originalFile = null;
    
    // 处理文件上传
    function handleFileSelect(file) {
        if (!file.type.startsWith('image/')) {
            alert('请上传图片文件！');
            return;
        }
        
        originalFile = file;
        displayOriginalImage(file);
        compressImage(file);
        
        previewContainer.style.display = 'flex';
        controlPanel.style.display = 'block';
    }
    
    // 显示原始图片
    async function displayOriginalImage(file) {
        const originalPreview = document.getElementById('originalPreview');
        const originalSize = document.getElementById('originalSize');
        
        originalPreview.src = URL.createObjectURL(file);
        originalSize.textContent = formatFileSize(file.size);
    }
    
    // 压缩图片
    async function compressImage(file) {
        const options = {
            maxSizeMB: 1,
            maxWidthOrHeight: 1920,
            useWebWorker: true,
            quality: parseFloat(qualitySlider.value)
        };
        
        try {
            const compressedFile = await imageCompression(file, options);
            const compressedPreview = document.getElementById('compressedPreview');
            const compressedSize = document.getElementById('compressedSize');
            
            compressedPreview.src = URL.createObjectURL(compressedFile);
            compressedSize.textContent = formatFileSize(compressedFile.size);
            
            // 更新下载按钮
            downloadBtn.onclick = () => {
                const link = document.createElement('a');
                link.href = compressedPreview.src;
                link.download = `compressed_${file.name}`;
                link.click();
            };
        } catch (error) {
            console.error('压缩失败:', error);
            alert('图片压缩失败，请重试！');
        }
    }
    
    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
    
    // 事件监听器
    uploadArea.onclick = () => fileInput.click();
    fileInput.onchange = (e) => handleFileSelect(e.target.files[0]);
    qualitySlider.oninput = (e) => {
        qualityValue.textContent = `${Math.round(e.target.value * 100)}%`;
        if (originalFile) {
            compressImage(originalFile);
        }
    };
    
    // 拖拽上传
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#0071e3';
    });
    
    uploadArea.addEventListener('dragleave', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
    });
    
    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#86868b';
        handleFileSelect(e.dataTransfer.files[0]);
    });
});

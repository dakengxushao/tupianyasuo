document.addEventListener('DOMContentLoaded', () => {
    // 获取DOM元素
    const uploadArea = document.getElementById('uploadArea');
    const fileInput = document.getElementById('fileInput');
    const quality = document.getElementById('quality');
    const qualityValue = document.getElementById('qualityValue');
    const originalPreview = document.getElementById('originalPreview');
    const compressedPreview = document.getElementById('compressedPreview');
    const originalSize = document.getElementById('originalSize');
    const compressedSize = document.getElementById('compressedSize');
    const downloadBtn = document.getElementById('downloadBtn');
    const compressionControls = document.querySelector('.compression-controls');
    const previewContainer = document.querySelector('.preview-container');

    let originalFile = null;

    // 上传区域点击事件
    uploadArea.addEventListener('click', () => {
        fileInput.click();
    });

    // 拖拽上传处理
    uploadArea.addEventListener('dragover', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = 'var(--primary-color)';
    });

    uploadArea.addEventListener('dragleave', () => {
        uploadArea.style.borderColor = '#DEDEDE';
    });

    uploadArea.addEventListener('drop', (e) => {
        e.preventDefault();
        uploadArea.style.borderColor = '#DEDEDE';
        const file = e.dataTransfer.files[0];
        if (file && file.type.match('image.*')) {
            handleFile(file);
        }
    });

    // 文件选择处理
    fileInput.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            handleFile(file);
        }
    });

    // 质量滑块变化事件
    quality.addEventListener('input', (e) => {
        qualityValue.textContent = `${e.target.value}%`;
        if (originalFile) {
            compressImage(originalFile, e.target.value / 100);
        }
    });

    // 处理上传的文件
    function handleFile(file) {
        originalFile = file;
        const reader = new FileReader();
        
        reader.onload = (e) => {
            originalPreview.src = e.target.result;
            originalSize.textContent = formatFileSize(file.size);
            
            // 显示控制和预览区域
            compressionControls.hidden = false;
            previewContainer.hidden = false;
            downloadBtn.hidden = false;
            
            // 开始压���
            compressImage(file, quality.value / 100);
        };
        
        reader.readAsDataURL(file);
    }

    // 压缩图片
    function compressImage(file, qualityValue) {
        const img = new Image();
        img.src = URL.createObjectURL(file);
        
        img.onload = () => {
            // 创建 Canvas
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            
            // 设置 Canvas 尺寸为图片原始尺寸
            canvas.width = img.width;
            canvas.height = img.height;
            
            // 在 Canvas 上绘制图片
            ctx.drawImage(img, 0, 0);
            
            // 将 Canvas 转换为 Blob
            canvas.toBlob((blob) => {
                // 更新压缩后的预览和大小
                compressedPreview.src = URL.createObjectURL(blob);
                compressedSize.textContent = formatFileSize(blob.size);
                
                // 设置下载按钮
                downloadBtn.onclick = () => {
                    const link = document.createElement('a');
                    link.href = URL.createObjectURL(blob);
                    link.download = `compressed_${file.name}`;
                    link.click();
                };
            }, file.type, qualityValue);
        };
    }

    // 格式化文件大小
    function formatFileSize(bytes) {
        if (bytes === 0) return '0 Bytes';
        const k = 1024;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
    }
}); 
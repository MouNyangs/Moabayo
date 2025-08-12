package com.sboot.moabayo.service;

import com.cloudinary.Cloudinary;
import com.cloudinary.Transformation;
import com.cloudinary.utils.ObjectUtils;
import com.sboot.moabayo.controller.CloudinaryUploaderController;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;
import java.util.Map;
import java.util.stream.Collectors;

// __Cloudinary__ Service
@Service
@RequiredArgsConstructor
public class ImageService {

    private final Cloudinary cloudinary;

    @Value("${cloudinary.folder:}")
    private String defaultFolder;

    /** Multipart 파일 업로드 (폼 파일) */
    public String upload(MultipartFile file) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                file.getBytes(),
                ObjectUtils.asMap(
                        "folder", defaultFolder,     // 선택
                        "use_filename", true,        // 원본파일명 사용
                        "unique_filename", true      // 중복방지
                )
        );
        return (String) result.get("secure_url"); // 최종 접근 URL
    }

    /** 로컬 파일 경로 업로드 */
    public String uploadLocalPath(String path) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                path,
                ObjectUtils.asMap("folder", defaultFolder)
        );
        return (String) result.get("secure_url");
    }

    /** 원격 URL 업로드 (Cloudinary가 직접 다운로드) */
    public String uploadFromUrl(String imageUrl) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                imageUrl,
                ObjectUtils.asMap("folder", defaultFolder)
        );
        return (String) result.get("secure_url");
    }

    /** Base64 업로드: data URL("data:image/png;base64,....") 가능 */
    public String uploadBase64(String dataUrl) throws IOException {
        Map<?, ?> result = cloudinary.uploader().upload(
                dataUrl,
                ObjectUtils.asMap("folder", defaultFolder)
        );
        return (String) result.get("secure_url");
    }

    /** 변환된 URL 생성 (리사이즈/크롭 등) - 업로드 후 public_id로 생성 */
    public String buildTransformedUrl(String publicId, int w, int h) {
        return cloudinary.url()
                .transformation(new Transformation()
                        .width(w).height(h).crop("fill"))
                .generate(publicId);
    }

    /** 삭제 (public_id 필요) */
    public void delete(String publicId) throws IOException {
        cloudinary.uploader().destroy(publicId, ObjectUtils.emptyMap());
    }
    
//		TODO: Cloudinary에 올라간 이미지 보는건 아직 구현중....    
//    public List<CloudinaryUploaderController.ImageInfo> listImages() throws IOException {
//        Map<?, ?> result = cloudinary.api().resources(
//            ObjectUtils.asMap(
//                "type", "upload",
//                "prefix", defaultFolder,  // 폴더 필터 (없으면 전체)
//                "max_results", 20
//            )
//        );
//
//        List<Map<String, Object>> resources = (List<Map<String, Object>>) result.get("resources");
//
//        return resources.stream()
//                .map(r -> new ImageController.ImageInfo(
//                        (String) r.get("public_id"),
//                        (String) r.get("secure_url")
//                ))
//                .collect(Collectors.toList());
//    }
}

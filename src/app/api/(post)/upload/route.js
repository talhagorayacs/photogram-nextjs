import dbConnect from "@/lib/dbconnect";
import { handleFileUpload } from "@/lib/uploadHandler";
import PostModel from "@/model/post.model";
export async function POST(request) {
  const formData = await request.formData();
  const name = formData.get("username");
  const id = formData.get("id");
  const userCaption = formData.get("caption");
  if (formData) {
    try {
      console.log(formData);
      
      const result = await handleFileUpload(formData);
      const photourl = result.secure_url;

      if (photourl) {
        try {
          dbConnect();
          const newPost = new PostModel({
            userId: id,
            username: name,
            caption: userCaption,
            photo: photourl,
            likes: [],
            comments: [],
          });

          await newPost.save();
        } catch (error) {
          console.log(error);

          return Response.json(
            {
              success: false,
              message: "error in updating database",
            },
            { status: 400 }
          );
        }
      }

      return Response.json({
        success: true,
        message: result.secure_url,
        userid: id,
        caption: userCaption,
        username: name,
      });
    } catch (error) {
      console.log(error);

      return Response.json(
        {
          success: false,
          message: error,
        },
        { status: 400 }
      );
    }
  }
}

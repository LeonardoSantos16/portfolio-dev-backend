import multer from 'multer'
import { Request } from 'express'

const ALLOWED_MIME_TYPES = ['image/jpeg', 'image/png', 'image/gif']

const upload = multer({
  storage: multer.memoryStorage(),

  limits: {
    fileSize: 5 * 1024 * 1024,
  },

  fileFilter: (
    req: Request,
    file: Express.Multer.File,
    cb: multer.FileFilterCallback
  ) => {
    if (ALLOWED_MIME_TYPES.includes(file.mimetype)) {
      cb(null, true)
    } else {
      cb(
        new Error(
          'Tipo de arquivo não suportado. Apenas JPEG, PNG e GIF são permitidos.'
        )
      )
    }
  },
})

export { upload }

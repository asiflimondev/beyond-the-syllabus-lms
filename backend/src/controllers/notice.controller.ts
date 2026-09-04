import { Request, Response } from 'express';
import { Notice } from '../models/Notice.model.js';

// ============================================
// GET PUBLISHED NOTICES (Public)
// ============================================
export const getPublishedNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 10, page = 1 } = req.query;

    const filter = {
      status: 'published',
      isDeleted: false,
    };

    const skip = (Number(page) - 1) * Number(limit);

    const notices = await Notice.find(filter)
      .sort({ publishedAt: -1, createdAt: -1 })
      .skip(skip)
      .limit(Number(limit))
      .select('title content category publishedAt createdAt');

    const total = await Notice.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        notices,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get published notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notices',
      error: error.message,
    });
  }
};

// ============================================
// GET LATEST NOTICES (Public - For Homepage)
// ============================================
export const getLatestNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { limit = 5 } = req.query;

    const notices = await Notice.find({
      status: 'published',
      isDeleted: false,
    })
      .sort({ publishedAt: -1, createdAt: -1 })
      .limit(Number(limit))
      .select('title content category publishedAt createdAt');

    res.status(200).json({
      success: true,
      data: notices,
    });
  } catch (error: any) {
    console.error('Get latest notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get latest notices',
      error: error.message,
    });
  }
};

// ============================================
// GET NOTICE BY ID (Public - Published Only)
// ============================================
export const getNoticeById = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;

    const notice = await Notice.findOne({
      _id: id,
      status: 'published',
      isDeleted: false,
    }).select('title content category publishedAt createdAt');

    if (!notice) {
      res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
      return;
    }

    res.status(200).json({
      success: true,
      data: notice,
    });
  } catch (error: any) {
    console.error('Get notice by id error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notice',
      error: error.message,
    });
  }
};

// ============================================
// GET ALL NOTICES (Admin)
// ============================================
export const getAllNotices = async (req: Request, res: Response): Promise<void> => {
  try {
    const { page = 1, limit = 10, status, category, search } = req.query;

    const filter: any = { isDeleted: false };
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (search) {
      filter.$or = [
        { title: { $regex: search, $options: 'i' } },
        { content: { $regex: search, $options: 'i' } },
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const notices = await Notice.find(filter)
      .populate('createdBy', 'email')
      .populate('updatedBy', 'email')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(Number(limit));

    const total = await Notice.countDocuments(filter);

    res.status(200).json({
      success: true,
      data: {
        notices,
        pagination: {
          total,
          page: Number(page),
          limit: Number(limit),
          totalPages: Math.ceil(total / Number(limit)),
        },
      },
    });
  } catch (error: any) {
    console.error('Get all notices error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get notices',
      error: error.message,
    });
  }
};

// ============================================
// CREATE NOTICE (Admin)
// ============================================
export const createNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { title, content, category, status } = req.body;
    const userId = (req as any).user?.id;

    if (!title || !content) {
      res.status(400).json({
        success: false,
        message: 'Title and content are required',
      });
      return;
    }

    const noticeData: any = {
      title,
      content,
      category: category || 'General',
      status: status || 'draft',
      createdBy: userId,
      updatedBy: userId,
    };

    // If status is 'published', set publishedAt
    if (status === 'published') {
      noticeData.publishedAt = new Date();
    }

    const notice = await Notice.create(noticeData);

    res.status(201).json({
      success: true,
      message: 'Notice created successfully',
      data: notice,
    });
  } catch (error: any) {
    console.error('Create notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create notice',
      error: error.message,
    });
  }
};

// ============================================
// UPDATE NOTICE (Admin)
// ============================================
export const updateNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { title, content, category, status } = req.body;
    const userId = (req as any).user?.id;

    const notice = await Notice.findById(id);
    if (!notice) {
      res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
      return;
    }

    const updateData: any = {
      updatedBy: userId,
    };

    if (title !== undefined) updateData.title = title;
    if (content !== undefined) updateData.content = content;
    if (category !== undefined) updateData.category = category;

    // Handle status change
    if (status !== undefined) {
      updateData.status = status;
      if (status === 'published' && notice.status !== 'published') {
        updateData.publishedAt = new Date();
      }
      if (status === 'draft') {
        updateData.publishedAt = null;
      }
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: 'Notice updated successfully',
      data: updatedNotice,
    });
  } catch (error: any) {
    console.error('Update notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update notice',
      error: error.message,
    });
  }
};

// ============================================
// DELETE NOTICE (Admin - Soft Delete)
// ============================================
export const deleteNotice = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const userId = (req as any).user?.id;

    const notice = await Notice.findById(id);
    if (!notice) {
      res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
      return;
    }

    // Soft delete
    notice.isDeleted = true;
    notice.deletedAt = new Date();
    notice.updatedBy = userId;
    await notice.save();

    res.status(200).json({
      success: true,
      message: 'Notice deleted successfully',
    });
  } catch (error: any) {
    console.error('Delete notice error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to delete notice',
      error: error.message,
    });
  }
};

// ============================================
// CHANGE NOTICE STATUS (Admin)
// ============================================
export const changeNoticeStatus = async (req: Request, res: Response): Promise<void> => {
  try {
    const { id } = req.params;
    const { status } = req.body;
    const userId = (req as any).user?.id;

    if (!status || !['draft', 'published'].includes(status)) {
      res.status(400).json({
        success: false,
        message: 'Valid status (draft or published) is required',
      });
      return;
    }

    const notice = await Notice.findById(id);
    if (!notice) {
      res.status(404).json({
        success: false,
        message: 'Notice not found',
      });
      return;
    }

    const updateData: any = {
      status,
      updatedBy: userId,
    };

    if (status === 'published') {
      updateData.publishedAt = new Date();
    } else {
      updateData.publishedAt = null;
    }

    const updatedNotice = await Notice.findByIdAndUpdate(
      id,
      updateData,
      { new: true, runValidators: true }
    );

    res.status(200).json({
      success: true,
      message: `Notice ${status === 'published' ? 'published' : 'unpublished'} successfully`,
      data: updatedNotice,
    });
  } catch (error: any) {
    console.error('Change notice status error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to change notice status',
      error: error.message,
    });
  }
};
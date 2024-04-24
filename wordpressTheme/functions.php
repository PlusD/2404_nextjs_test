<?php 
/*-----------------------------------------
	ウィジェットの登録
-------------------------------------------*/
function theme_slug_widgets_init() {
    register_sidebar( array(
        'name' => 'サイドバー', //ウィジェットの名前を入力
        'id' => 'sidebar', //ウィジェットに付けるid名を入力
    ) );
}
add_action( 'widgets_init', 'theme_slug_widgets_init' );

/*-----------------------------------------
	WPGraphQLにページネーション用のフィールドを追加する
-------------------------------------------*/
// WPGraphQLにカスタムフィールドを追加するフック
add_action('graphql_register_types', function() {
    // カスタムフィールド 'allPostCounts' を登録
    register_graphql_field('RootQuery', 'allPostCounts', [
        'type' => ['list_of' => 'AllPostCounts'], // カスタムデータの型を定義
        'description' => 'Retrieve all post types and their counts', // 説明
        'resolve' => function() {
            // WordPressで登録されているすべての投稿タイプを取得
            $post_types = get_post_types(['public' => true], 'objects');
            
            $result = [];
            foreach ($post_types as $post_type) {
                $post_count = wp_count_posts($post_type->name)->publish; // 各投稿タイプの公開済み投稿数を取得
                $result[] = [
                    'postType' => $post_type->name,
                    'count' => $post_count
                ];
            }
            return $result;
        }
    ]);
});

// カスタムデータ型 'AllPostCounts' を定義
add_action('graphql_register_types', function() {
    register_graphql_object_type('AllPostCounts', [
        'description' => 'Custom type for post type counts',
        'fields' => [
            'postType' => [
                'type' => 'String', // 投稿タイプの名前
                'description' => 'Name of the post type'
            ],
            'count' => [
                'type' => 'Int', // 投稿数
                'description' => 'Count of posts for the post type'
            ]
        ]
    ]);
});

// ページネーション
add_action('graphql_register_types', function() {
    register_graphql_field('RootQuery', 'paginatedPosts', [
        'type' => 'PostPaginationType',
        'description' => 'Get paginated posts for a given page number',
        'args' => [
            'page' => [
                'type' => 'Int',
                'description' => 'Page number to fetch',
            ],
            'perPage' => [
                'type' => 'Int',
                'description' => 'Number of posts per page',
                'defaultValue' => 10, // Default posts per page
            ],
        ],
        'resolve' => function($root, $args) {
			$page = isset($args['page']) ? $args['page'] : 1;
			$perPage = isset($args['perPage']) ? $args['perPage'] : 10;
			$offset = ($page - 1) * $perPage;

			$query = new WP_Query([
				'post_type' => 'post',
				'posts_per_page' => $perPage,
				'offset' => $offset,
			]);

			if (empty($query->posts)) {
				throw new \Exception('No posts found');
			}

			return [
				'allposts' => array_map(function ($post) {
					return [
						'id' => $post->ID,
						'title' => get_the_title($post->ID),
					];
				}, $query->posts),
				'pagination' => [
					'total' => $query->found_posts,
					'totalPages' => ceil($query->found_posts / $perPage),
					'currentPage' => $page,
				],
			];
		}
    ]);

    register_graphql_object_type('PostPaginationType', [
        'fields' => [
            'allposts' => [
                'type' => ['list_of' => 'Post'],
                'description' => 'List of posts for the given page',
            ],
            'pagination' => [
                'type' => 'PaginationInfo',
                'description' => 'Pagination details for the query',
            ],
        ],
    ]);

    register_graphql_object_type('PaginationInfo', [
        'fields' => [
            'total' => [
                'type' => 'Int',
                'description' => 'Total number of posts',
            ],
            'totalPages' => [
                'type' => 'Int',
                'description' => 'Total number of pages',
            ],
            'currentPage' => [
                'type' => 'Int',
                'description' => 'Current page number',
            ],
        ],
    ]);
});


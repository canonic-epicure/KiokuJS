Class('KiokuJS.Exception', {
    
    has : {
        nativeEx        : {
            trait       : 'KiokuJS.Feature.Attribute.Skip',
        },
        
        message         : { is : 'rw' },
        description     : 'Unknown exception'
    },
    
    
    methods : {
        
        toString : function () {
            return this.meta.name + ': ' + this.description + ', ' + this.getMessage()
        }
    }
    
//    ,
//    
//    
//    my : {
//        
//        has : {
//            HOST        : null
//        },
//        
//        methods : {
//            
//            $throw : function (arg) {
//                throw new Error(new this.HOST(arg))
//            } 
//        }
//    }
})

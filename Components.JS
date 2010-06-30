COMPONENTS = {
    
    "Core" : [
        "KiokuJS.Reference",
        "KiokuJS.Role.Serializer",
        "KiokuJS.Serializer.JSON",
        
        "KiokuJS.TypeMap",
        "KiokuJS.TypeMap.Role.NoDeps",
        "KiokuJS.TypeMap.Array",
        "KiokuJS.TypeMap.Object",
        "KiokuJS.TypeMap.Joose",
        
        "KiokuJS.Resolver",
        "KiokuJS.Resolver.Standard",
        
        "KiokuJS.Role.Resolvable",
        
        "KiokuJS.Collapser.Inliner",
        
        "KiokuJS.Linker.Gatherer",
        "KiokuJS.Linker.Expander",
        
        "KiokuJS.Node",
        
        "KiokuJS.Backend.Role.SkipFixture",
        
        "KiokuJS.Backend",
        "KiokuJS.Backend.Hash",
        
        "KiokuJS.Collapser",
        "KiokuJS.Linker",
        
        "KiokuJS.Scope",
        "KiokuJS"
    ],
    
    
    "Bundle" : [
        "jsan:Task.Joose.Core",
        "jsan:Task.JooseX.Attribute.Bootstrap",
        "jsan:JooseX.SimpleRequest",
        "jsan:Task.JooseX.Namespace.Depended.Web",
        "jsan:Task.JooseX.CPS.All",
        "jsan:Data.UUID",
        "jsan:Data.Visitor",
        "+Core"    
    ],
    
    
    "Test" : [
        "+Bundle",
        "KiokuJS.Test.Fixture",
        "KiokuJS.Test.Fixture.ObjectGraph",
        "KiokuJS.Test"
    ]
} 


